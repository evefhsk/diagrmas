/* ============================================================
   js/viewport.js — Zoom (rueda + botones), paneo por arrastre,
   "ajustar a pantalla" y estado de transformación por diagrama.
   ============================================================ */

/**
 * Controlador del lienzo (viewport) para un SVG de diagrama.
 *
 * @param {Object} options
 * @param {HTMLElement} options.viewport    contenedor con scroll/cursor de arrastre
 * @param {SVGElement}  options.svg         elemento SVG del diagrama actual
 * @param {Object}      options.config      { width, height, viewBoxX, viewBoxY }
 * @param {Function}   [options.onZoomChange] callback(nivelZoomTexto)
 */
function createViewportController(options) {
  const viewport = options.viewport;
  const svg = () => options.svg;
  const config = options.config;

  const transform = { scale: 1.0, panX: 0, panY: 0 };
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function updateTransform() {
    svg().style.transform =
      `translate(${transform.panX}px, ${transform.panY}px) scale(${transform.scale})`;
    if (options.onZoomChange) {
      options.onZoomChange(`${Math.round(transform.scale * 100)}%`);
    }
  }

  function zoom(delta, clientX = null, clientY = null) {
    const oldScale = transform.scale;
    const newScale = Math.min(Math.max(oldScale + delta, 0.15), 3.0);
    if (newScale === oldScale) return;
    if (clientX !== null && clientY !== null) {
      const rect = viewport.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      transform.panX = mouseX - ((mouseX - transform.panX) * (newScale / oldScale));
      transform.panY = mouseY - ((mouseY - transform.panY) * (newScale / oldScale));
    }
    transform.scale = newScale;
    updateTransform();
  }

  function fitToScreen() {
    const rect = viewport.getBoundingClientRect();
    const availableW = rect.width - 32;
    const availableH = rect.height - 40;
    const scaleX = availableW / config.width;
    const scaleY = availableH / config.height;
    const fittedScale = Math.min(scaleX, scaleY, 1.0);
    transform.scale = fittedScale;
    transform.panX = Math.max(10, (rect.width - config.width * fittedScale) / 2 - config.viewBoxX * fittedScale);
    transform.panY = Math.max(10, (rect.height - config.height * fittedScale) / 2 - config.viewBoxY * fittedScale);
    updateTransform();
  }

  // Rueda del ratón: zoom centrado en el cursor.
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.08 : -0.08, e.clientX, e.clientY);
  }, { passive: false });

  // Arrastre: paneo.
  viewport.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    startX = e.clientX - transform.panX;
    startY = e.clientY - transform.panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    transform.panX = e.clientX - startX;
    transform.panY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  return { zoom, fitToScreen, updateTransform, transform };
}
