export function initFiltersAccordion({
  wrapEl,
  toggleBtn,
  loadFiltersOpen,
  saveFiltersOpen,
  durationMs = 180,
} = {}) {
  if (!wrapEl || !toggleBtn) return null;

  function setOpen(isOpen, { focusFirst = true } = {}) {
    // если открываем — снимаем hidden до анимации
    if (isOpen) wrapEl.hidden = false;

    wrapEl.classList.add("is-collapsing");
    wrapEl.style.height = "auto";
    const target = wrapEl.scrollHeight;

    const from = isOpen ? 0 : target;
    const to = isOpen ? target : 0;

    wrapEl.style.height = `${from}px`;

    requestAnimationFrame(() => {
      wrapEl.style.transition = `height ${durationMs}ms ease`;
      wrapEl.style.height = `${to}px`;

      const onEnd = () => {
        wrapEl.removeEventListener("transitionend", onEnd);
        wrapEl.style.transition = "";
        wrapEl.style.height = "";
        wrapEl.classList.remove("is-collapsing");

        if (!isOpen) wrapEl.hidden = true;
        wrapEl.classList.toggle("is-open", isOpen);

        toggleBtn.setAttribute("aria-expanded", String(isOpen));

        if (isOpen && focusFirst) {
          const first = wrapEl.querySelector(
            "select, input, button, textarea, [tabindex]:not([tabindex='-1'])",
          );
          first?.focus?.();
        }
      };

      wrapEl.addEventListener("transitionend", onEnd);
    });

    if (typeof saveFiltersOpen === "function") saveFiltersOpen(isOpen);
  }

  function toggle({ focusFirst = true } = {}) {
    const isOpen = !wrapEl.hidden;
    setOpen(!isOpen, { focusFirst });
  }

  const open = typeof loadFiltersOpen === "function" ? loadFiltersOpen() : false;
  wrapEl.hidden = !open;
  wrapEl.classList.toggle("is-open", open);
  toggleBtn.setAttribute("aria-expanded", String(open));

  const onClick = () => toggle({ focusFirst: true });
  toggleBtn.addEventListener("click", onClick);

  return {
    setOpen,
    toggle,
    isOpen: () => !wrapEl.hidden,
    destroy: () => toggleBtn.removeEventListener("click", onClick),
  };
}