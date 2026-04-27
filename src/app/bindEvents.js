export function bindEvents({
  dom,
  form,
  handlers,
} = {}) {
  const cleanups = [];

  function on(el, event, fn) {
    if (!el || typeof fn !== "function") return;
    el.addEventListener(event, fn);
    cleanups.push(() => el.removeEventListener(event, fn));
  }

  on(dom?.currencySelectEl, "change", handlers?.onCurrencyChange);
  on(dom?.monthlyBudgetInputEl, "input", handlers?.onMonthlyBudgetInput);
  on(dom?.themeToggleBtn, "click", handlers?.onThemeClick);
  on(form, "submit", handlers?.onSubmit);
  on(form, "click", handlers?.onFormClick);
  on(form?.elements?.type, "change", handlers?.onFormTypeChange);
  on(dom?.listEl, "click", handlers?.onListClick);
  on(dom?.clearAllBtn, "click", handlers?.onClearAll);

  on(dom?.filterTypeEl, "change", handlers?.onFilterTypeChange);
  on(dom?.filterCategoryEl, "change", handlers?.onFilterCategoryChange);
  on(dom?.filterQueryEl, "input", handlers?.onFilterQueryInput);
  on(dom?.filterPeriodEl, "change", handlers?.onFilterPeriodChange);
  on(dom?.filterFromEl, "change", handlers?.onFilterFromChange);
  on(dom?.filterToEl, "change", handlers?.onFilterToChange);
  on(dom?.resetFiltersBtn, "click", handlers?.onResetFilters);
  on(dom?.sortOrderEl, "change", handlers?.onSortChange);

  on(dom?.openCreateBtn, "click", handlers?.onOpenCreate);
  on(dom?.closeModalBtn, "click", handlers?.onCloseModal);
  on(dom?.cancelEditBtn, "click", handlers?.onCancelEdit);
  on(dom?.exportCsvBtn, "click", handlers?.onExportCsv);
  on(dom?.loadMoreBtn, "click", handlers?.onLoadMore);

  on(dom?.modalEl, "click", handlers?.onModalOverlayClick);
  on(document, "keydown", handlers?.onKeyDown);

  return {
    destroy() {
      for (const fn of cleanups) fn();
    },
  };
}
