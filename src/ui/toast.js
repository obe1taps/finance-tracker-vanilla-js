const TOAST_ICONS = {
  success: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <polyline points="8 12 11 15 16 9"></polyline>
    </svg>
  `,
  danger: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <line x1="9" y1="9" x2="15" y2="15"></line>
      <line x1="15" y1="9" x2="9" y2="15"></line>
    </svg>
  `,
  info: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9"></circle>
      <line x1="12" y1="10" x2="12" y2="16"></line>
      <circle cx="12" cy="7" r="1"></circle>
    </svg>
  `,
};

export function createToast({ toastsEl, escapeHtml }) {
  function showToast({
    title,
    text = "",
    type = "info",
    icon = "",
    ms = 2500,
    actionText = "",
    onAction = null,
  }) {
    if (!toastsEl) return;
  
    const iconHtml = icon || TOAST_ICONS[type] || TOAST_ICONS.info;
  
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
  
    toast.innerHTML = `
      <div class="toast__icon">${iconHtml}</div>
      <div>
        <div class="toast__title">${escapeHtml(title)}</div>
        ${text ? `<div class="toast__text">${escapeHtml(text)}</div>` : ""}
      </div>
      ${
        actionText
          ? `<div class="toast__actions">
               <button class="toast__btn" type="button" data-action="toast-action">
                 ${escapeHtml(actionText)}
               </button>
             </div>`
          : ""
      }
      <div class="toast__progress" data-progress="true"></div>
    `;
  
    toastsEl.appendChild(toast);
  
    requestAnimationFrame(() => {
      toast.classList.add("is-show");
    });
  
    const progressEl = toast.querySelector("[data-progress='true']");
    if (progressEl) {
      progressEl.style.transitionDuration = `${ms}ms`;
      requestAnimationFrame(() => {
        progressEl.classList.add("is-anim");
      });
    }
  
    let closed = false;
    let timer = null;
  
    const close = () => {
      if (closed) return;
      closed = true;
  
      if (timer) clearTimeout(timer);
  
      toast.classList.remove("is-show");
      toast.addEventListener(
        "transitionend",
        () => {
          toast.remove();
        },
        { once: true },
      );
    };
  
    // action button
    if (actionText && typeof onAction === "function") {
      const btn = toast.querySelector("[data-action='toast-action']");
      btn?.addEventListener("click", () => {
        onAction();
        close();
      });
    }
  
    timer = setTimeout(close, ms);
  }
  return { showToast };
}