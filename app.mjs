import { dateKey, parseDate, dayIndex } from "./tracker.mjs";
import { RESULTS_KEY, exercises, emptyResult, validateResults, setExerciseResult, previousResult } from "./results.mjs";

const $ = id => document.getElementById(id);
const planRows = [...document.querySelectorAll("#plan tbody tr")];
const plan = planRows.map(row => ({
    day: row.cells[0].textContent.trim(),
    type: row.cells[1].textContent.trim(),
    exercises: row.cells[2].innerHTML.split(/<br\s*\/?>/i).map(text => text.trim())
}));
const fullDate = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });
let todayKey = dateKey(new Date());
let results;

function showResultsError(message) {
    $("results-error").textContent = message;
    $("results-error").hidden = false;
}

function readResults() {
    const raw = localStorage.getItem(RESULTS_KEY);
    return raw === null ? { version: 1, entries: {} } : validateResults(JSON.parse(raw));
}

function loadResults() {
    try {
        results = readResults();
        $("results-error").hidden = true;
    } catch (error) {
        results = null;
        showResultsError(`Nie można odczytać wyników. Nie nadpisujemy danych. Pola są zablokowane; sprawdź dostęp do pamięci i odśwież stronę. Szczegóły: ${error.message}`);
    }
}

const resultFields = {
    text: { label: "Wynik / notatka", placeholder: "Np. 30 min, 3 km, spokojne tempo" },
    sets: { label: "Serie", min: "1", step: "1" },
    reps: { label: "Powtórzenia / serię", min: "1", step: "1" },
    weight: { label: "Ciężar (kg)", min: "0", step: "any" },
    seconds: { label: "Czas / serię (s)", min: "0", step: "any" }
};

function formatResult(result) {
    if (Object.hasOwn(result, "text")) return result.text;
    const parts = [];
    if (result.sets !== null) parts.push(`Serie: ${result.sets}`);
    if (result.reps != null) parts.push(`Powt./serię: ${result.reps}`);
    if (result.weight != null) parts.push(`Ciężar: ${result.weight.toLocaleString("pl-PL")} kg`);
    if (result.seconds != null) parts.push(`Czas/serię: ${result.seconds.toLocaleString("pl-PL")} s`);
    return parts.join(" · ");
}

function renderResultInputs(item) {
    const list = $("today").querySelector("ul");
    list.className = "exercise-results";
    list.replaceChildren();
    for (const title of item.exercises) {
        const name = title.split(" - ")[0];
        const exercise = exercises.find(entry => entry.name === name);
        if (!exercise) throw new Error(`Brak definicji wyniku dla ćwiczenia: ${name}`);
        const li = document.createElement("li");
        const group = document.createElement("fieldset");
        group.dataset.exercise = exercise.id;
        group.dataset.date = todayKey;
        group.disabled = results === null;
        const legend = document.createElement("legend");
        legend.textContent = title;
        const previous = document.createElement("p");
        previous.className = "previous-result";
        previous.id = `${exercise.id}-previous`;
        const last = results ? previousResult(results, todayKey, exercise.id) : null;
        previous.textContent = results === null ? "Ostatni wynik niedostępny."
            : last ? `Ostatnio (${fullDate.format(parseDate(last.date))}): ${formatResult(last.result)}`
            : "Ostatnio: brak wcześniejszego wyniku.";
        const fields = document.createElement("div");
        fields.className = "result-fields";
        const current = results?.entries[todayKey]?.[exercise.id] || emptyResult(exercise.id);
        for (const [field, value] of Object.entries(current)) {
            const definition = resultFields[field];
            const label = document.createElement("label");
            label.textContent = definition.label;
            const input = document.createElement(field === "text" ? "textarea" : "input");
            input.id = `${exercise.id}-${field}`;
            input.dataset.field = field;
            input.setAttribute("aria-describedby", previous.id);
            label.htmlFor = input.id;
            if (field === "text") {
                input.rows = 2;
                input.maxLength = 2000;
                input.placeholder = definition.placeholder;
            } else {
                input.type = "number";
                input.min = definition.min;
                input.step = definition.step;
                input.inputMode = ["sets", "reps"].includes(field) ? "numeric" : "decimal";
            }
            input.value = value ?? "";
            label.append(input);
            fields.append(label);
        }
        const feedback = document.createElement("p");
        feedback.className = "result-feedback";
        feedback.setAttribute("role", "status");
        feedback.setAttribute("aria-live", "polite");
        group.append(legend, previous, fields, feedback);
        li.append(group);
        list.append(li);
    }
}

function saveResult(event) {
    const input = event.target;
    if (!input.matches("[data-field]") || !input.dataset.dirty) return;
    const group = input.closest("fieldset");
    const feedback = group.querySelector(".result-feedback");
    try {
        if (!input.checkValidity()) {
            input.reportValidity();
            throw new Error("Sprawdź wartość pola: serie i powtórzenia to dodatnie liczby całkowite, ciężar nie może być ujemny.");
        }
        const latest = readResults();
        const id = group.dataset.exercise;
        const key = group.dataset.date;
        const current = latest.entries[key]?.[id] || emptyResult(id);
        const value = input.dataset.field === "text" ? input.value : input.value === "" ? null : input.valueAsNumber;
        const next = setExerciseResult(latest, key, id, { ...current, [input.dataset.field]: value });
        localStorage.setItem(RESULTS_KEY, JSON.stringify(next));
        results = next;
        delete input.dataset.dirty;
        $("results-error").hidden = true;
        feedback.textContent = "Zapisano automatycznie.";
        return true;
    } catch (error) {
        feedback.textContent = "Nie zapisano zmiany.";
        showResultsError(`Nie zapisano wyniku. Wpisana wartość pozostaje w polu; popraw ją lub spróbuj ponownie po sprawdzeniu pamięci przeglądarki. Szczegóły: ${error.message}`);
        return false;
    }
}

function renderToday() {
    const today = parseDate(todayKey);
    const item = plan[dayIndex(today)];
    $("today").innerHTML = `
        <p class="eyebrow">DZISIAJ · ${item.day.toLocaleUpperCase("pl-PL")} · <time datetime="${todayKey}">${fullDate.format(today)}</time></p>
        <h2 id="today-heading">${dayIndex(today) === 6 ? "Dzisiaj regeneracja" : item.type}</h2>
        <ul>${item.exercises.map(exercise => `<li>${exercise}</li>`).join("")}</ul>`;
    if (dayIndex(today) === 6) {
        const note = document.createElement("p");
        note.textContent = "Odpoczynek jest częścią planu.";
        $("today").append(note);
    } else {
        const help = document.createElement("p");
        help.className = "results-help";
        help.textContent = "Wyniki zapisują się w tej przeglądarce po opuszczeniu pola. Poniżej tylko ostatni wcześniejszy zapis każdego ćwiczenia.";
        $("today").querySelector("ul").before(help);
        renderResultInputs(item);
        const warmup = document.createElement("details");
        const strengthDay = dayIndex(today) % 2 === 1;
        warmup.innerHTML = `
            <summary>Rozgrzewka przed treningiem</summary>
            ${strengthDay ? `
                <p>Wt. / czw. / sob. — około 6 minut + serie przygotowawcze. Zawsze ten sam schemat.</p>
                <ol>
                    <li><strong>Energiczny marsz lub rowerek</strong> — 3 minuty.</li>
                    <li><strong>Przysiad bez ciężaru</strong> — 8 powtórzeń.</li>
                    <li><strong>Skłon biodrowy bez ciężaru</strong> — 8 powtórzeń, biodra w tył jak do RDL.</li>
                    <li><strong>Pompki przy ścianie lub wysokim podparciu</strong> — 8 powtórzeń.</li>
                    <li><strong>Lekkie wiosłowanie gumą lub na wyciągu</strong> — 10 powtórzeń.</li>
                </ol>
                <p>Następnie przed każdym ćwiczeniem:</p>
                <ul>
                    <li><strong>Pierwsze ćwiczenie:</strong> 2–3 krótkie serie ze stopniowym dokładaniem ciężaru.</li>
                    <li><strong>Kolejne ćwiczenia:</strong> zwykle 1–2 serie przygotowawcze.</li>
                    <li><strong>W podciąganiu:</strong> łatwiejszy wariant, np. z podparciem lub wspomaganiem.</li>
                </ul>
                <p>Serie przygotowawcze nie wliczają się do trzech serii z planu.
                Mają przygotować ruch, nie zmęczyć — bez dochodzenia do granicy możliwości.</p>
            ` : `
                <p>Pon. / śr. / pt. — około 6 minut. Zawsze ten sam schemat.</p>
                <ol>
                    <li><strong>Spokojny marsz → energiczny marsz</strong> — 4 minuty, stopniowo przyspieszając.</li>
                    <li><strong>Wspięcia na palce</strong> — 10 powtórzeń.</li>
                    <li><strong>Naprzemienne unoszenie kolan w marszu</strong> — 30 sekund.</li>
                    <li><strong>Dwa krótkie odcinki bardzo lekkiego truchtu</strong> — po 20 sekund,
                    przedzielone 20 sekundami marszu.</li>
                </ol>
                <p>Potem zaczynasz marszobieg spokojnym tempem. Przed dodatkami wystarczy
                jedna lekka seria każdego ćwiczenia — np. krótszy plank lub Wall Sit,
                mniejszy ciężar na ramiona.</p>
            `}
            <p>Wszystko w komfortowym zakresie. Przy bólu nie forsuj ruchu.</p>`;
        $("today").append(warmup);
    }
}

function render() {
    renderToday();
    planRows.forEach((row, index) => {
        row.classList.toggle("is-today", index === dayIndex(parseDate(todayKey)));
    });
}

function refreshDate() {
    const nextKey = dateKey(new Date());
    if (nextKey !== todayKey) {
        const pending = $("today").querySelector("[data-dirty]");
        if (pending && !saveResult({ target: pending })) return;
        todayKey = nextKey;
        loadResults();
        render();
    }
}
window.addEventListener("pageshow", refreshDate);
document.addEventListener("focusout", saveResult);
document.addEventListener("input", event => {
    if (event.target.matches("[data-field]")) {
        event.target.dataset.dirty = "true";
        event.target.closest("fieldset").querySelector(".result-feedback").textContent = "Niezapisana zmiana — opuść pole, aby zapisać.";
    }
});
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshDate();
});
setInterval(refreshDate, 60000);

loadResults();
render();
$("tracker").hidden = false;
