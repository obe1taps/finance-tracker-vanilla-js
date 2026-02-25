import { todayISO } from "../utils/utils.js";

function toISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysISO(iso, days) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function getDefaultFilters() {
  return {
    type: "all",
    category: "all",
    query: "",
    sort: "desc",
    period: "all",
    from: "",
    to: "",
  };
}

export function getPeriodRange(filters) {
  const today = todayISO();
  const period = filters.period || "all";

  if (period === "all") return { from: "", to: "" };
  if (period === "7d") return { from: addDaysISO(today, -6), to: today };
  if (period === "30d") return { from: addDaysISO(today, -29), to: today };

  if (period === "month") {
    const d = new Date(today + "T00:00:00");
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    return { from: toISODate(first), to: today };
  }

  if (period === "year") {
    const d = new Date(today + "T00:00:00");
    const first = new Date(d.getFullYear(), 0, 1);
    return { from: toISODate(first), to: today };
  }

  const from = (filters.from || "").trim();
  const to = (filters.to || "").trim();
  return { from, to };
}

function inRangeISO(dateISO, from, to) {
  if (!dateISO) return false;
  if (from && dateISO < from) return false;
  if (to && dateISO > to) return false;
  return true;
}

export function applyFilters(list, filters) {
  const q = (filters.query || "").trim().toLowerCase();
  const { from, to } = getPeriodRange(filters);

  const filtered = list.filter((t) => {
    const typeOk = filters.type === "all" ? true : t.type === filters.type;
    const catOk =
      filters.category === "all" ? true : t.category === filters.category;

    const note = (t.note || "").toLowerCase();
    const queryOk = q === "" ? true : note.includes(q);

    const dateOk = inRangeISO(t.date, from, to);

    return typeOk && catOk && queryOk && dateOk;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "asc") return a.date.localeCompare(b.date);
    return b.date.localeCompare(a.date);
  });
}

export function resetFilters(prevFilters) {
  return getDefaultFilters();
}