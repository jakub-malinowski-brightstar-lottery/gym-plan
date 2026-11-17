import test from "node:test";
import assert from "node:assert/strict";
import { dateKey, parseDate, startOfWeek, addDays, summarize, validateData, setStatus } from "./tracker.mjs";

test("tydzień zaczyna się w poniedziałek także na granicy roku i w niedzielę", () => {
    assert.equal(dateKey(startOfWeek(parseDate("2027-01-03"))), "2026-12-28");
    assert.equal(dateKey(startOfWeek(parseDate("2027-01-04"))), "2027-01-04");
});

test("lokalne daty zachowują dzień przy zmianie czasu", () => {
    for (const key of ["2026-03-28", "2026-10-24"]) {
        const before = parseDate(key);
        const after = addDays(before, 2);
        assert.equal(after.getDate(), before.getDate() + 2);
        assert.equal(after.getHours(), 12);
        assert.equal(dateKey(parseDate(dateKey(after))), dateKey(after));
    }
});

test("zapis i cofnięcie nie usuwają poprzednich tygodni ani nie mutują historii", () => {
    const original = validateData({ version: 1, entries: { "2026-11-09": "done" } });
    const saved = setStatus(original, "2026-11-17", "done", parseDate("2026-11-17"));
    assert.equal(original.entries["2026-11-17"], undefined);
    const undone = setStatus(saved, "2026-11-17", "planned", parseDate("2026-11-17"));
    assert.equal(undone.entries["2026-11-09"], "done");
    assert.equal(undone.entries["2026-11-17"], undefined);
});

test("podsumowanie oddziela częściowe sesje i nie dolicza niedzieli ani innego tygodnia", () => {
    const entries = {
        "2026-11-09": "done", "2026-11-16": "done", "2026-11-17": "partial",
        "2026-11-18": "skipped", "2026-11-22": "done"
    };
    assert.deepEqual(summarize(entries, parseDate("2026-11-16")), { done: 1, partial: 1, skipped: 1 });
});

test("nie zapisujemy przyszłych treningów, niedziel ani obcych statusów", () => {
    const data = { version: 1, entries: {} };
    const today = parseDate("2026-11-17");
    for (const [key, status] of [["2026-11-18", "done"], ["2026-11-15", "done"], ["2026-11-17", "other"]]) {
        assert.throws(() => setStatus(data, key, status, today));
    }
});

test("import odrzuca zły format, nieistniejące daty i niedozwolone wpisy", () => {
    for (const data of [
        null, [], { version: 2, entries: {} }, { version: 1, entries: [] },
        { version: 1, entries: { "2026-02-30": "done" } },
        { version: 1, entries: { "2026-11-17": "planned" } },
        { version: 1, entries: { "2026-11-22": "done" } },
        { version: 1, entries: { "<script>": "done" } }
    ]) assert.throws(() => validateData(data));
    const data = { version: 1, entries: { "2026-11-17": "partial" } };
    assert.equal(JSON.stringify(validateData(JSON.parse(JSON.stringify(data)))), JSON.stringify(data));
});
