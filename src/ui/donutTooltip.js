import { hitTestDonut, setDonutActive, clearDonutActive } from "./charts.js";

export function attachDonutTooltip({
  canvas,
  getCurrency,
  formatMoney,
  escapeHtml,
} = {}) {
  if (!canvas) return;

  const host = canvas.parentElement;
  if (!host) return;

  // tooltip element
  let tip = host.querySelector(".chartTip");
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "chartTip";
    host.appendChild(tip);
  }

  const hide = () => {
    tip.classList.remove("is-show");
    clearDonutActive(canvas);
  };

  const renderContent = (hit) => {
    const currency = typeof getCurrency === "function" ? getCurrency() : "RUB";
    const safeCategory =
      typeof escapeHtml === "function" ? escapeHtml(hit.category) : String(hit.category);

    tip.innerHTML = `
      <div class="chartTip__title">
        <span class="chartTip__dot" style="background:${hit.color}"></span>
        ${safeCategory}
      </div>
      <div class="chartTip__row"><span>Сумма</span><strong>${formatMoney(hit.total, currency)}</strong></div>
      <div class="chartTip__row"><span>Доля</span><strong>${hit.pct}%</strong></div>
    `;
  };

  const position = (clientX, clientY) => {
    const hostRect = host.getBoundingClientRect();
    const x = clientX - hostRect.left;
    const y = clientY - hostRect.top;

    const pad = 10;

    const tipRect = tip.getBoundingClientRect();
    const w = tipRect.width || 180;
    const h = tipRect.height || 60;

    let left = x + 12;
    let top = y + 12;

    const maxLeft = host.clientWidth - w - pad;
    const maxTop = host.clientHeight - h - pad;

    left = Math.max(pad, Math.min(left, maxLeft));
    top = Math.max(pad, Math.min(top, maxTop));

    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
  };

  const showAt = (clientX, clientY, { sticky = false } = {}) => {
    const hit = hitTestDonut(canvas, clientX, clientY);
    if (!hit) {
      if (!sticky) hide();
      return;
    }

    setDonutActive(canvas, hit.index);
    renderContent(hit);
    position(clientX, clientY);
    tip.classList.add("is-show");
  };

  // mouse
  const onMove = (e) => showAt(e.clientX, e.clientY);
  const onLeave = () => hide();

  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mouseleave", onLeave);

  canvas.addEventListener("click", (e) => {
    const hit = hitTestDonut(canvas, e.clientX, e.clientY);
    if (!hit) {
      hide();
      return;
    }
    showAt(e.clientX, e.clientY, { sticky: true });
  });

  canvas.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      showAt(t.clientX, t.clientY, { sticky: true });
    },
    { passive: true },
  );

  const onHostClick = (e) => {
    if (e.target === canvas) return;
    hide();
  };
  host.addEventListener("click", onHostClick);

  return () => {
    canvas.removeEventListener("mousemove", onMove);
    canvas.removeEventListener("mouseleave", onLeave);
    host.removeEventListener("click", onHostClick);
  };
}