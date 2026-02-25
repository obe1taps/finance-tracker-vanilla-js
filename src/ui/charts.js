import { formatMoney as defaultFormatMoney } from "../utils/utils.js";
import { selectCategoryTotals, selectTopWithOther } from "../domain/selectors.js";

export const PALETTE = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#a855f7",
  "rgb(163, 237, 250)",
  "#eab308",
  "#ef4444",
  "#14b8a6",
  "#f43f5e",
  "#84cc16",
  "#60a5fa",
  "#fb7185",
];

export function buildColorMap(categories, palette = PALETTE) {
  const keys = Array.from(
    new Set(categories.map((c) => String(c || "Без категории"))),
  ).sort((a, b) => a.localeCompare(b, "ru"));

  const map = new Map();
  for (let i = 0; i < keys.length; i++) {
    map.set(keys[i], palette[i % palette.length]);
  }
  return map;
}

function setupCanvas(canvas) {
  if (!canvas) return null;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  const cssWidth = Math.max(10, rect.width);
  const cssHeight = Math.max(10, rect.height || 180);

  const nextW = Math.round(cssWidth * dpr);
  const nextH = Math.round(cssHeight * dpr);

  if (canvas.width !== nextW || canvas.height !== nextH) {
    canvas.width = nextW;
    canvas.height = nextH;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: cssWidth, h: cssHeight };
}

const DONUT_STATE = new WeakMap();

export function clearDonutActive(canvas) {
  const st = DONUT_STATE.get(canvas);
  if (!st) return;
  if (st.activeIndex !== -1) {
    st.activeIndex = -1;
    drawDonut(canvas, st.items, {
      title: st.title,
      colorMap: st.colorMap,
      activeIndex: -1,
      currency: st.currency,
      formatMoney: st.formatMoney,
    });
  }
}

export function setDonutActive(canvas, index) {
  const st = DONUT_STATE.get(canvas);
  if (!st) return;
  const next = typeof index === "number" ? index : -1;
  if (st.activeIndex === next) return;

  st.activeIndex = next;
  drawDonut(canvas, st.items, {
    title: st.title,
    colorMap: st.colorMap,
    activeIndex: next,
    currency: st.currency,
    formatMoney: st.formatMoney,
  });
}

export function hitTestDonut(canvas, clientX, clientY) {
  const st = DONUT_STATE.get(canvas);
  if (!st) return null;

  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const dx = x - st.cx;
  const dy = y - st.cy;
  const r = Math.sqrt(dx * dx + dy * dy);

  if (r < st.rInner || r > st.rOuter) return null;

  let ang = Math.atan2(dy, dx);
  if (ang < 0) ang += Math.PI * 2;

  const ang2 = ang + Math.PI * 2;

  for (let i = 0; i < st.segments.length; i++) {
    const seg = st.segments[i];

    const hit =
      (ang >= seg.a1 && ang < seg.a2) ||
      (ang2 >= seg.a1 && ang2 < seg.a2);

    if (hit) {
      const pct = st.total ? Math.round((seg.total / st.total) * 100) : 0;
      return {
        index: i,
        category: seg.category,
        total: seg.total,
        pct,
        color: seg.color,
        x,
        y,
      };
    }
  }

  return null;
}

function cssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return v && v.trim() ? v.trim() : fallback;
}

function drawDonut(
  canvas,
  items,
  {
    title,
    colorMap,
    activeIndex = -1,
    currency = "RUB",
    formatMoney = defaultFormatMoney,
  },
) {
  const s = setupCanvas(canvas);
  if (!s) return;

  const { ctx, w, h } = s;
  ctx.clearRect(0, 0, w, h);

  if (!items || items.length === 0) {
    ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillStyle = cssVar("--chart-empty", "rgba(148, 163, 184, 0.9)");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Нет данных", Math.round(w / 2), Math.round(h / 2));
    ctx.textAlign = "start";

    DONUT_STATE.set(canvas, {
      title,
      items: [],
      colorMap,
      total: 0,
      segments: [],
      cx: Math.round(w / 2),
      cy: Math.round(h / 2),
      rOuter: 0,
      rInner: 0,
      activeIndex: -1,
      currency,
      formatMoney,
    });
    return;
  }

  const total = items.reduce((sum, x) => sum + x.total, 0);
  if (total <= 0) return;

  const cx = Math.round(w / 2);
  const cy = Math.round(h / 2);

  const rOuter = Math.floor(Math.min(w, h) * 0.38);
  const rInner = Math.floor(rOuter * 0.62);

  const segments = [];
  let angle = -Math.PI / 2;

  for (let i = 0; i < items.length; i++) {
    const frac = items[i].total / total;
    const a2 = angle + frac * Math.PI * 2;

    const color = colorMap?.get(items[i].category) || "#94a3b8";
    segments.push({
      category: items[i].category,
      total: items[i].total,
      color,
      a1: (angle + Math.PI * 2) % (Math.PI * 2),
      a2: (a2 + Math.PI * 2) % (Math.PI * 2),
    });

    angle = a2;
  }

  for (const seg of segments) {
    if (seg.a2 < seg.a1) seg.a2 += Math.PI * 2;
  }

  // draw
  angle = -Math.PI / 2;

  for (let i = 0; i < items.length; i++) {
    const frac = items[i].total / total;
    const a2 = angle + frac * Math.PI * 2;

    const isActive = i === activeIndex;
    const isDim = activeIndex !== -1 && !isActive;

    const color = colorMap?.get(items[i].category) || "#94a3b8";
    const outer = isActive ? rOuter + 6 : rOuter;

    ctx.globalAlpha = isDim ? 0.35 : 1;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, a2);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = cssVar("--chart-stroke", "rgba(15, 23, 42, 0.18)");
    ctx.lineWidth = isActive ? 3 : 2;
    ctx.stroke();

    angle = a2;
  }

  ctx.globalAlpha = 1;

  // hole
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  // center text
  ctx.fillStyle = cssVar("--chart-center", "rgba(226, 232, 240, 0.92)");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(title, cx, cy - 10);

  const label =
    typeof formatMoney === "function"
      ? formatMoney(total, currency)
      : `${Math.round(total)} ₽`;

  ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(label, cx, cy + 12);

  ctx.textAlign = "start";

  DONUT_STATE.set(canvas, {
    title,
    items,
    colorMap,
    total,
    segments,
    cx,
    cy,
    rOuter,
    rInner,
    activeIndex,
    currency,
    formatMoney,
  });
}

// opts: { currency, formatMoney, colorMaps }
export function renderCategoryCharts({ chartExpense, chartIncome }, transactions, opts = {}) {
  const currency = opts.currency || "RUB";
  const formatMoney = opts.formatMoney || defaultFormatMoney;
  const colorMaps = opts.colorMaps || null;

  const expense = selectTopWithOther(selectCategoryTotals(transactions, "expense"), 6, "Другое");
  const income = selectTopWithOther(selectCategoryTotals(transactions, "income"), 6, "Другое");

  const expenseColorMap =
    colorMaps?.expenseColorMap || buildColorMap(expense.map((x) => x.category));
  const incomeColorMap =
    colorMaps?.incomeColorMap || buildColorMap(income.map((x) => x.category));

  const expActive = DONUT_STATE.get(chartExpense)?.activeIndex ?? -1;
  const incActive = DONUT_STATE.get(chartIncome)?.activeIndex ?? -1;

  drawDonut(chartExpense, expense, {
    title: "Расходы",
    colorMap: expenseColorMap,
    activeIndex: expActive,
    currency,
    formatMoney,
  });

  drawDonut(chartIncome, income, {
    title: "Доходы",
    colorMap: incomeColorMap,
    activeIndex: incActive,
    currency,
    formatMoney,
  });

  return { expenseColorMap, incomeColorMap };
}