export function formatMoney(value, currency = "RUB") {
  const num = Number(value) || 0;

  const locale =
    currency === "USD" ? "en-US" :
    "ru-RU";

  const hasCents = currency === "USD" || currency === "BYN";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(num);
}

export function generateId() {
  return `t_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function parseMoneyInput(raw) {
  const s = String(raw ?? "").trim();

  if (!s) return NaN;

  const normalized = s
    .replace(/\s|\u00A0/g, "")
    .replace(",", ".")
    .replace(/[^0-9.-]/g, "");

  const n = Number(normalized);
  return Number.isFinite(n) ? n : NaN;
}
