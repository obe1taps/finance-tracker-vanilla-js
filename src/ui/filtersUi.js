import { getPeriodRange } from "../domain/filters.js";

export function applyFiltersToDom(dom, filters) {
  if (!dom) return;

  if (dom.filterTypeEl) dom.filterTypeEl.value = filters.type;
  if (dom.filterCategoryEl) dom.filterCategoryEl.value = filters.category;
  if (dom.filterQueryEl) dom.filterQueryEl.value = filters.query;
  if (dom.sortOrderEl) dom.sortOrderEl.value = filters.sort;

  if (dom.filterPeriodEl) dom.filterPeriodEl.value = filters.period;

  syncPeriodUI(dom, filters);
}

export function syncPeriodUI(dom, filters) {
  const isCustom = filters.period === "custom";

  if (dom.filterFromEl) dom.filterFromEl.disabled = !isCustom;
  if (dom.filterToEl) dom.filterToEl.disabled = !isCustom;

  const { from, to } = getPeriodRange(filters);

  if (dom.filterFromEl) dom.filterFromEl.value = from || "";
  if (dom.filterToEl) dom.filterToEl.value = to || "";
}