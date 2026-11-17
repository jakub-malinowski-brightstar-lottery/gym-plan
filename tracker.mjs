export const STORAGE_KEY = "gym-plan.history.v1";
export const statuses = {
    planned: "Zaplanowany",
    done: "Zrobiony",
    partial: "Częściowo",
    skipped: "Pominięty"
};

export function dateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDate(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) throw new Error("Nieprawidłowy format daty.");
    const [year, month, day] = key.split("-").map(Number);
    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(12, 0, 0, 0);
    if (dateKey(date) !== key) throw new Error("Nieprawidłowa data w historii.");
    return date;
}

export function addDays(date, count) {
    const result = new Date(date);
    result.setDate(result.getDate() + count);
    return result;
}

export function dayIndex(date) {
    return (date.getDay() + 6) % 7;
}

export function startOfWeek(date) {
    return addDays(parseDate(dateKey(date)), -dayIndex(date));
}

export function summarize(entries, monday) {
    const result = { done: 0, partial: 0, skipped: 0 };
    for (let day = 0; day < 6; day++) {
        const status = entries[dateKey(addDays(monday, day))];
        if (Object.hasOwn(result, status)) result[status]++;
    }
    return result;
}

export function validateData(data) {
    if (!data || typeof data !== "object" || Array.isArray(data) || data.version !== 1 ||
        !data.entries || typeof data.entries !== "object" || Array.isArray(data.entries)) {
        throw new Error("To nie jest obsługiwana kopia trackera (wersja 1).");
    }
    const entries = Object.create(null);
    for (const [key, status] of Object.entries(data.entries)) {
        const date = parseDate(key);
        if (!["done", "partial", "skipped"].includes(status) || dayIndex(date) === 6) {
            throw new Error("Historia zawiera nieprawidłowy status lub trening w niedzielę.");
        }
        entries[key] = status;
    }
    return { version: 1, entries };
}

export function setStatus(data, key, status, today = new Date()) {
    const date = parseDate(key);
    if (key > dateKey(today) || dayIndex(date) === 6 || !Object.hasOwn(statuses, status)) {
        throw new Error("Możesz zapisać tylko dzisiejszy lub wcześniejszy trening.");
    }
    const entries = { ...data.entries };
    if (status === "planned") delete entries[key];
    else entries[key] = status;
    return validateData({ version: 1, entries });
}
