import { dateKey, parseDate, dayIndex } from "./tracker.mjs";

export const RESULTS_KEY = "gym-plan.results.v1";
export const exercises = [
    { id: "walk-run", name: "30 min marszobiegu", kind: "text" },
    { id: "face-pull", name: "Face Pull", kind: "strength" },
    { id: "tibialis-raise", name: "Tibialis Raise", kind: "strength" },
    { id: "plank", name: "Plank", kind: "timed" },
    { id: "light-squat", name: "Lekki Przysiad", kind: "strength" },
    { id: "bench-press", name: "Bench Press", kind: "strength" },
    { id: "row", name: "Wiosłowanie", kind: "strength" },
    { id: "wall-sit", name: "Wall Sit", kind: "timed" },
    { id: "curl", name: "Uginanie ramion", kind: "strength" },
    { id: "triceps-extension", name: "Prostowanie ramion", kind: "strength" },
    { id: "rdl", name: "RDL", kind: "strength" },
    { id: "ohp", name: "OHP", kind: "strength" },
    { id: "pull-up", name: "Podciąganie", kind: "strength" },
    { id: "squat", name: "Przysiad", kind: "strength" },
    { id: "incline-bench-db", name: "Incline Bench DB", kind: "strength" }
];

export function emptyResult(id) {
    const exercise = exercises.find(item => item.id === id);
    if (!exercise) throw new Error("Nieznane ćwiczenie.");
    if (exercise.kind === "text") return { text: "" };
    if (exercise.kind === "timed") return { sets: null, seconds: null };
    return { sets: null, reps: null, weight: null };
}

function validateResult(id, result) {
    const template = emptyResult(id);
    if (!result || typeof result !== "object" || Array.isArray(result) ||
        Object.keys(result).length !== Object.keys(template).length ||
        Object.keys(template).some(field => !Object.hasOwn(result, field))) {
        throw new Error("Nieprawidłowe pola wyniku ćwiczenia.");
    }
    const validated = {};
    for (const field of Object.keys(template)) {
        const value = result[field];
        if (field === "text") {
            if (typeof value !== "string" || value.length > 2000) {
                throw new Error("Opis wyniku musi być tekstem do 2000 znaków.");
            }
            validated[field] = value.trim();
        } else {
            if (value !== null && (typeof value !== "number" || !Number.isFinite(value) ||
                (field === "weight" ? value < 0 : value <= 0) ||
                (["sets", "reps"].includes(field) && !Number.isInteger(value)))) {
                throw new Error("Serie i powtórzenia muszą być dodatnimi liczbami całkowitymi, czas dodatnią liczbą, a ciężar nieujemną.");
            }
            validated[field] = value;
        }
    }
    return validated;
}

function hasResult(result) {
    return Object.values(result).some(value => value !== null && value !== "");
}

export function validateResults(data) {
    if (!data || typeof data !== "object" || Array.isArray(data) || data.version !== 1 ||
        !data.entries || typeof data.entries !== "object" || Array.isArray(data.entries)) {
        throw new Error("Nieprawidłowy format zapisanych wyników (wersja 1).");
    }
    const entries = Object.create(null);
    for (const [key, day] of Object.entries(data.entries)) {
        if (dayIndex(parseDate(key)) === 6 || !day || typeof day !== "object" || Array.isArray(day)) {
            throw new Error("Nieprawidłowy dzień w wynikach ćwiczeń.");
        }
        const results = Object.create(null);
        for (const [id, result] of Object.entries(day)) {
            const validated = validateResult(id, result);
            if (hasResult(validated)) results[id] = validated;
        }
        if (Object.keys(results).length) entries[key] = results;
    }
    return { version: 1, entries };
}

export function setExerciseResult(data, key, id, result, today = new Date()) {
    if (key > dateKey(today) || dayIndex(parseDate(key)) === 6) {
        throw new Error("Możesz zapisać tylko dzisiejszy lub wcześniejszy trening, poza niedzielą.");
    }
    const validated = validateResult(id, result);
    const entries = { ...data.entries };
    const day = { ...entries[key] };
    if (hasResult(validated)) day[id] = validated;
    else delete day[id];
    if (Object.keys(day).length) entries[key] = day;
    else delete entries[key];
    return validateResults({ version: 1, entries });
}

export function previousResult(data, key, id) {
    const dates = Object.keys(data.entries).filter(date => date < key && Object.hasOwn(data.entries[date], id));
    dates.sort();
    const date = dates.at(-1);
    return date ? { date, result: data.entries[date][id] } : null;
}
