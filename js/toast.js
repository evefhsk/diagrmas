/* ============================================================
   js/toast.js — Notificaciones tipo "toast" sobre el lienzo.
   ============================================================ */

/**
 * Crea un gestor de notificaciones para un elemento toast.
 * @param {HTMLElement} toastEl contenedor con .toast (usa [data-toast-text] e [data-toast-icon])
 */
function createToast(toastEl) {
  const textEl = toastEl.querySelector('[data-toast-text]');
  const iconEl = toastEl.querySelector('[data-toast-icon]');
  let timeoutId = null;

  function show(text, icon = '&bull;', duration = 2500) {
    if (timeoutId) clearTimeout(timeoutId);
    textEl.textContent = text;
    iconEl.innerHTML = icon;
    toastEl.classList.add('show');
    timeoutId = setTimeout(() => toastEl.classList.remove('show'), duration);
  }

  return { show };
}
