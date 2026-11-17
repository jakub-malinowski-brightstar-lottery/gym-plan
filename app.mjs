import { STORAGE_KEY, statuses, dateKey, parseDate, addDays, dayIndex, startOfWeek, summarize, validateData, setStatus } from "./tracker.mjs";

const $ = id => document.getElementById(id);
const rows = [...document.querySelectorAll("#plan tbody tr")];
const plan = rows.map(row => ({
    day: row.cells[0].textContent.trim(),
    type: row.cells[1].textContent.trim(),
    exercises: row.cells[2].innerHTML.split(/<br\s*\/?>/i).map(text => text.trim())
}));
const shortDate = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short" });
const fullDate = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });
let todayKey = dateKey(new Date());
let monday = startOfWeek(new Date());
let data;
let storageHealthy = true;

function showError(message) {
    $("error").textContent = message;
    $("error").hidden = false;
    $("feedback").textContent = "";
}

function clearError() {
    $("error").hidden = true;
    $("error").textContent = "";
}

function readData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? { version: 1, entries: {} } : validateData(JSON.parse(raw));
}

function load() {
    try {
        data = readData();
        storageHealthy = true;
        clearError();
    } catch (error) {
        data = null;
        storageHealthy = false;
        showError(`Nie można odczytać historii. Nie nadpisujemy danych. Możesz wczytać poprawną kopię. Szczegóły: ${error.message}`);
    }
}

function controls(key, prefix) {
    const status = data ? (data.entries[key] || "planned") : null;
    const disabled = !storageHealthy || key > todayKey;
    const button = document.createElement("button");
    button.type = "button";
    button.id = `${prefix}-done`;
    button.dataset.date = key;
    button.dataset.status = status === "done" ? "planned" : "done";
    button.textContent = status === "done" ? "Cofnij wykonanie" : "Trening zrobiony ✓";
    button.disabled = disabled;
    button.setAttribute("aria-label", `${button.textContent}, ${fullDate.format(parseDate(key))}`);

    const select = document.createElement("select");
    select.id = `${prefix}-status`;
    select.dataset.date = key;
    select.disabled = disabled;
    select.setAttribute("aria-label", `Status treningu: ${fullDate.format(parseDate(key))}`);
    if (!data) select.add(new Option("Historia niedostępna", "", true, true));
    for (const [value, text] of Object.entries(statuses)) {
        const option = new Option(text, value, false, value === status);
        select.add(option);
    }
    return [button, select];
}

function renderToday() {
    const today = parseDate(todayKey);
    const item = plan[dayIndex(today)];
    $("today").innerHTML = `
        <p class="eyebrow">DZISIAJ · ${item.day.toLocaleUpperCase("pl-PL")}</p>
        <p class="date">${fullDate.format(today)}</p>
        <h2 id="today-heading">${dayIndex(today) === 6 ? "Dzisiaj regeneracja" : item.type}</h2>
        <ul>${item.exercises.map(exercise => `<li>${exercise}</li>`).join("")}</ul>`;
    if (dayIndex(today) === 6) {
        const note = document.createElement("p");
        note.textContent = "Nie musisz nic odhaczać. Odpoczynek jest częścią planu.";
        $("today").append(note);
    } else {
        const [button, select] = controls(todayKey, "today");
        const label = document.createElement("label");
        label.htmlFor = select.id;
        label.textContent = "Albo zapisz, jak poszło:";
        $("today").append(button, label, select);
    }
}

function render() {
    const focusedId = document.activeElement?.id;
    renderToday();
    $("week-label").textContent = `${shortDate.format(monday)} – ${fullDate.format(addDays(monday, 6))}`;
    $("next-week").disabled = dateKey(monday) >= dateKey(startOfWeek(parseDate(todayKey)));
    $("current-week").disabled = dateKey(monday) === dateKey(startOfWeek(parseDate(todayKey)));
    const summary = data ? summarize(data.entries, monday) : null;
    $("progress-label").textContent = summary ? `${summary.done} z 6 treningów ukończone` : "Historia niedostępna";
    $("week-progress").value = summary?.done || 0;
    $("week-progress").hidden = !summary;
    $("week-detail").textContent = summary
        ? `Częściowo: ${summary.partial} · Pominięte: ${summary.skipped}. Niedziela to regeneracja, nie siódmy trening.`
        : "Przywróć poprawną kopię lub odblokuj zapis w przeglądarce.";
    rows.forEach((row, index) => {
        const date = addDays(monday, index);
        const key = dateKey(date);
        row.classList.toggle("is-today", key === todayKey);
        row.cells[0].textContent = plan[index].day;
        const dateLabel = document.createElement("span");
        dateLabel.className = "day-date";
        dateLabel.textContent = `${shortDate.format(date)}${key === todayKey ? " · dzisiaj" : ""}`;
        row.cells[0].append(dateLabel);
        const cell = row.querySelector(".status-cell");
        cell.replaceChildren();
        if (index === 6) cell.textContent = "Dzień odpoczynku";
        else cell.append(...controls(key, `day-${index}`));
    });
    $("export").disabled = !storageHealthy;
    if (focusedId) document.getElementById(focusedId)?.focus({ preventScroll: true });
}

function saveStatus(key, status) {
    if (!storageHealthy) return;
    try {
        const latest = readData();
        const next = setStatus(latest, key, status);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        data = next;
        clearError();
        const message = status === "done"
            ? "Zapisane. Kolejny krok za Tobą — dobra robota!"
            : status === "planned" ? "Cofnięto wpis. Możesz zaznaczyć go ponownie."
            : status === "partial" ? "Zapisane. Część treningu też warto zauważyć."
            : "Zapisane. Wróć do planu, kiedy będziesz gotowy.";
        $("feedback").textContent = `${fullDate.format(parseDate(key))}: ${message}`;
    } catch (error) {
        load();
        showError(`Nie zapisano zmiany. Sprawdź dostęp do pamięci przeglądarki. Szczegóły: ${error.message}`);
    }
    render();
}

const statusHeading = document.createElement("th");
statusHeading.scope = "col";
statusHeading.textContent = "Twój trening";
document.querySelector("#plan thead tr").append(statusHeading);
rows.forEach(row => {
    const cell = row.insertCell();
    cell.className = "status-cell";
});

document.addEventListener("click", event => {
    const button = event.target.closest("button[data-status]");
    if (button) saveStatus(button.dataset.date, button.dataset.status);
});
document.addEventListener("change", event => {
    if (event.target.matches("select[data-date]")) saveStatus(event.target.dataset.date, event.target.value);
});
$("previous-week").addEventListener("click", () => { monday = addDays(monday, -7); render(); });
$("next-week").addEventListener("click", () => { monday = addDays(monday, 7); render(); });
$("current-week").addEventListener("click", () => { monday = startOfWeek(parseDate(todayKey)); render(); });

$("export").addEventListener("click", () => {
    try {
        const latest = readData();
        const url = URL.createObjectURL(new Blob([JSON.stringify(latest, null, 2)], { type: "application/json" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = `gym-plan-${dateKey(new Date())}.json`;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        $("feedback").textContent = "Przygotowano kopię. Zapisz plik w bezpiecznym miejscu.";
    } catch (error) {
        showError(`Nie udało się przygotować kopii. Szczegóły: ${error.message}`);
    }
});

$("import").addEventListener("change", async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
        if (file.size > 1024 * 1024) throw new Error("Plik przekracza limit 1 MB.");
        const imported = validateData(JSON.parse(await file.text()));
        const count = Object.keys(imported.entries).length;
        if (!window.confirm(`Wczytać kopię (liczba wpisów: ${count})? Zastąpi to CAŁĄ obecną historię, także wpisy nieobecne w kopii. Tej operacji nie można cofnąć bez wcześniejszego eksportu.`)) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(imported));
        data = imported;
        storageHealthy = true;
        clearError();
        $("feedback").textContent = `Wczytano kopię. Liczba wpisów: ${count}.`;
        render();
    } catch (error) {
        showError(`Nie wczytano kopii. Dotychczasowa historia nie została zastąpiona. Szczegóły: ${error.message}`);
    } finally {
        event.target.value = "";
    }
});

function refreshDate() {
    const nextKey = dateKey(new Date());
    if (nextKey !== todayKey) {
        const wasCurrent = dateKey(monday) === dateKey(startOfWeek(parseDate(todayKey)));
        todayKey = nextKey;
        if (wasCurrent) monday = startOfWeek(parseDate(todayKey));
        render();
    }
}
window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY || event.key === null) { load(); render(); }
});
window.addEventListener("pageshow", () => { refreshDate(); load(); render(); });
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) { refreshDate(); load(); render(); }
});
setInterval(refreshDate, 60000);

load();
render();
$("tracker").hidden = false;
$("backup").hidden = false;
