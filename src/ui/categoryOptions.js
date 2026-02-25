export function syncCategoryOptionsByType(form, type) {
  const categorySelect = form?.elements?.category;
  if (!categorySelect) return false;

  const options = Array.from(categorySelect.options);

  for (const opt of options) {
    const optType = opt.dataset.type;
    opt.hidden = optType !== type;
  }

  const selected = categorySelect.selectedOptions[0];
  if (selected?.hidden) {
    const firstVisible = options.find((o) => !o.hidden);
    if (firstVisible) categorySelect.value = firstVisible.value;
    return true;
  }

  return false;
}

export function syncFilterCategoryOptions(filterTypeEl, filterCategoryEl) {
  if (!filterCategoryEl || !filterTypeEl) return null;

  const type = filterTypeEl.value;
  const options = Array.from(filterCategoryEl.options);

  for (const opt of options) {
    if (opt.value === "all") {
      opt.hidden = false;
      continue;
    }
    const optType = opt.dataset.type;
    opt.hidden = type === "all" ? false : optType !== type;
  }

  const selected = filterCategoryEl.selectedOptions[0];
  if (selected?.hidden) {
    filterCategoryEl.value = "all";
    return "all";
  }

  return null;
}