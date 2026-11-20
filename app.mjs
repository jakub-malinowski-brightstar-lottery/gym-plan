import { dateKey, parseDate, dayIndex } from "./tracker.mjs";

const $ = id => document.getElementById(id);
const planRows = [...document.querySelectorAll("#plan tbody tr")];
const plan = planRows.map(row => ({
    day: row.cells[0].textContent.trim(),
    type: row.cells[1].textContent.trim(),
    exercises: row.cells[2].innerHTML.split(/<br\s*\/?>/i).map(text => text.trim())
}));
const fullDate = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });
let todayKey = dateKey(new Date());

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
        note.textContent = "Odpoczynek jest częścią planu.";
        $("today").append(note);
    } else {
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
        todayKey = nextKey;
        render();
    }
}
window.addEventListener("pageshow", refreshDate);
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshDate();
});
setInterval(refreshDate, 60000);

render();
$("tracker").hidden = false;
