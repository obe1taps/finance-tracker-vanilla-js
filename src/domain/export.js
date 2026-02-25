function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r;]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function downloadTextFile(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export function exportTransactionsToCSV(list) {
  const headers = ["Дата", "Тип", "Категория", "Сумма", "Комментарий"];

  const rows = list.map((t) => [
    t.date,
    t.type === "income" ? "Доход" : "Расход",
    t.category,
    t.amount,
    t.note || "",
  ]);

  const sep = ";";

  const csv = [
    headers.map(csvEscape).join(sep),
    ...rows.map((r) => r.map(csvEscape).join(sep)),
  ].join("\n");

  const bom = "\uFEFF";
  const today = new Date().toISOString().slice(0, 10);

  downloadTextFile(
    `finance-tracker-${today}.csv`,
    bom + csv,
    "text/csv;charset=utf-8",
  );
}