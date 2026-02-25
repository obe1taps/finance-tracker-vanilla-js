function toNumber(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

export function selectTotals(transactions) {
  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    const amount = toNumber(t.amount);
    if (t.type === "income") income += amount;
    if (t.type === "expense") expense += amount;
  }

  return { income, expense, balance: income - expense };
}

export function selectCategoryTotals(transactions, type) {
  const map = new Map();

  for (const t of transactions) {
    if (t.type !== type) continue;

    const key = t.category || "Без категории";
    map.set(key, (map.get(key) || 0) + toNumber(t.amount));
  }

  const items = Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);

  return items;
}

export function selectTopWithOther(items, topN = 6, otherLabel = "Другое") {
  if (items.length <= topN) return items;

  const top = items.slice(0, topN);
  const rest = items.slice(topN);
  const otherTotal = rest.reduce((sum, x) => sum + toNumber(x.total), 0);

  if (otherTotal > 0) top.push({ category: otherLabel, total: otherTotal });
  return top;
}