import test from "node:test";
import assert from "node:assert/strict";
import { parseDate } from "./tracker.mjs";
import { emptyResult, validateResults, setExerciseResult, previousResult } from "./results.mjs";

const today = parseDate("2026-11-20");
const empty = () => ({ version: 1, entries: {} });

test("wyniki tekstowe, siłowe i czasowe przetrwają zapis i ponowny odczyt", () => {
    let data = empty();
    for (const [id, result] of [
        ["walk-run", { text: "  30 min, 3 km  " }],
        ["face-pull", { sets: 3, reps: 18, weight: 12.5 }],
        ["plank", { sets: 3, seconds: 45 }],
        ["tibialis-raise", { sets: 2, reps: 20, weight: 0 }]
    ]) data = setExerciseResult(data, "2026-11-20", id, result, today);
    const restored = validateResults(JSON.parse(JSON.stringify(data)));
    assert.equal(restored.entries["2026-11-20"]["walk-run"].text, "30 min, 3 km");
    assert.deepEqual(restored.entries["2026-11-20"]["face-pull"], { sets: 3, reps: 18, weight: 12.5 });
    assert.deepEqual(restored.entries["2026-11-20"].plank, { sets: 3, seconds: 45 });
    assert.equal(restored.entries["2026-11-20"]["tibialis-raise"].weight, 0);
});

test("ostatni wynik pochodzi z wcześniejszego dnia, niezależnie od dnia tygodnia i kolejności wpisów", () => {
    let data = empty();
    for (const [key, reps] of [["2026-11-20", 20], ["2026-11-16", 15], ["2026-11-09", 12]]) {
        data = setExerciseResult(data, key, "face-pull", { sets: 3, reps, weight: 10 }, today);
    }
    data = setExerciseResult(data, "2026-11-18", "curl", { sets: 3, reps: 12, weight: 8 }, today);
    const previous = previousResult(data, "2026-11-20", "face-pull");
    assert.equal(previous.date, "2026-11-16");
    assert.equal(previous.result.reps, 15);
    assert.equal(previousResult(data, "2026-11-09", "face-pull"), null);
    assert.equal(previousResult(data, "2026-11-20", "plank"), null);
});

test("poprawianie i wyczyszczenie wyniku zachowuje inne ćwiczenia i dni bez mutowania danych", () => {
    const original = setExerciseResult(empty(), "2026-11-16", "plank", { sets: 3, seconds: 30 }, today);
    let data = setExerciseResult(original, "2026-11-20", "plank", { sets: 2, seconds: null }, today);
    data = setExerciseResult(data, "2026-11-20", "face-pull", { sets: null, reps: 16, weight: null }, today);
    data = setExerciseResult(data, "2026-11-20", "plank", emptyResult("plank"), today);
    assert.equal(original.entries["2026-11-20"], undefined);
    assert.equal(data.entries["2026-11-20"].plank, undefined);
    assert.equal(data.entries["2026-11-20"]["face-pull"].reps, 16);
    assert.equal(previousResult(data, "2026-11-20", "plank").result.seconds, 30);
    data = setExerciseResult(data, "2026-11-20", "face-pull", emptyResult("face-pull"), today);
    assert.equal(data.entries["2026-11-20"], undefined);
});

test("błędne liczby i pola nie są zapisywane", () => {
    for (const result of [
        { sets: 0, reps: 15, weight: 10 }, { sets: 1.5, reps: 15, weight: 10 },
        { sets: 3, reps: -1, weight: 10 }, { sets: 3, reps: 12.5, weight: 10 },
        { sets: 3, reps: 15, weight: -1 }, { sets: 3, reps: 15, weight: Infinity },
        { sets: 3, reps: "15", weight: 10 }, { sets: 3, reps: 15 },
        { sets: 3, reps: 15, weight: 10, seconds: 30 }
    ]) assert.throws(() => setExerciseResult(empty(), "2026-11-20", "face-pull", result, today));
    assert.throws(() => setExerciseResult(empty(), "2026-11-20", "plank", { sets: 3, seconds: 0 }, today));
    assert.throws(() => setExerciseResult(empty(), "2026-11-20", "walk-run", { text: "a".repeat(2001) }, today));
});

test("uszkodzona pamięć, nieznane ćwiczenia, niedziela i przyszłe zapisy są odrzucane", () => {
    for (const data of [
        null, [], { version: 2, entries: {} }, { version: 1, entries: [] },
        { version: 1, entries: { "2026-02-30": {} } },
        { version: 1, entries: { "2026-11-22": {} } },
        { version: 1, entries: { "2026-11-20": [] } },
        { version: 1, entries: { "2026-11-20": { unknown: { text: "x" } } } }
    ]) assert.throws(() => validateResults(data));
    for (const key of ["2026-11-21", "2026-11-15"]) {
        assert.throws(() => setExerciseResult(empty(), key, "plank", { sets: 3, seconds: 30 }, today));
    }
});
