// src/modal.js
export function createModal({ modalEl, form }) {
  let lastFocusEl = null;

  function open() {
    lastFocusEl = document.activeElement;

    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    setTimeout(() => form.elements.amount?.focus(), 0);
  }

  function close({ onClose } = {}) {
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (typeof onClose === "function") onClose();

    if (lastFocusEl && typeof lastFocusEl.focus === "function") {
      setTimeout(() => lastFocusEl.focus(), 0);
    }
  }

  function isOpen() {
    return modalEl.classList.contains("is-open");
  }

  return { open, close, isOpen };
}