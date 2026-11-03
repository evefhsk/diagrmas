/* ============================================================
   js/exporter.js — Exportación del diagrama actual a SVG y PNG
   (300 DPI), sin depender de librerías externas.
   ============================================================ */

/**
 * Clona el SVG de trabajo y le aplica el viewBox/tamaño reales,
 * limpiando los resaltados de simulación para la exportación.
 */
function prepareExportClone(svgEl, config) {
  const cloneSvg = svgEl.cloneNode(true);
  cloneSvg.removeAttribute('style');
  cloneSvg.setAttribute('width', config.width);
  cloneSvg.setAttribute('height', config.height);
  cloneSvg.setAttribute('viewBox', `${config.viewBoxX} ${config.viewBoxY} ${config.width} ${config.height}`);
  cloneSvg.querySelectorAll('.active-path').forEach(p => p.classList.remove('active-path'));
  cloneSvg.querySelectorAll('.active-state').forEach(s => s.classList.remove('active-state'));
  return cloneSvg;
}

function triggerDownload(blobUrl, filename) {
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

/** Exporta el SVG como archivo .svg (con fuentes embebidas por @import). */
function exportSvg(svgEl, config) {
  const cloneSvg = prepareExportClone(svgEl, config);
  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(cloneSvg);
  const styleElement = `<style>@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;600;700&display=swap'); text { font-family: 'Inter', sans-serif; }</style>`;
  svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString.replace('<defs>', `<defs>${styleElement}`);

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${config.exportName}.svg`);
  URL.revokeObjectURL(url);
}

/** Renderiza el SVG en un canvas a 300 DPI (factor 3.125) y descarga el PNG. */
function exportPng(svgEl, config, onDone) {
  const cloneSvg = prepareExportClone(svgEl, config);
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(cloneSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const URLObj = window.URL || window.webkitURL || window;
  const blobURL = URLObj.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function () {
    const scaleFactor = 3.125; // 96 dpi * 3.125 ≈ 300 dpi
    const targetWidth = Math.round(config.width * scaleFactor);
    const targetHeight = Math.round(config.height * scaleFactor);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const pngUrl = URLObj.createObjectURL(pngBlob);
      triggerDownload(pngUrl, `${config.exportName}.png`);
      URLObj.revokeObjectURL(pngUrl);
      URLObj.revokeObjectURL(blobURL);
      if (onDone) onDone();
    }, 'image/png');
  };
  img.src = blobURL;
}
