/* ============================================================
   js/diagram-page.js — Lógica común a todas las páginas de
   diagrama: render del SVG desde /diagrams, navegación entre
   pestañas (páginas), zoom/paneo, panel de especificación y
   exportación SVG/PNG.
   ============================================================ */

(function () {
  const diagramKey = document.body.dataset.diagram;
  const config = Object.assign({}, DIAGRAM_CONFIGS[diagramKey]);
  if (typeof DIAGRAM_SVG !== 'undefined' && DIAGRAM_SVG[diagramKey]) {
    config.inlineSvg = DIAGRAM_SVG[diagramKey];
  }
  if (!config) {
    console.error(`Diagrama desconocido: "${diagramKey}"`);
    return;
  }

  // ----- Referencias al DOM -----
  const viewportContainer = document.getElementById('viewportContainer');
  const pane = document.getElementById('diagramPane');
  const zoomLevelText = document.getElementById('zoomLevelText');
  const infoPanel = document.getElementById('infoPanel');
  const toastEl = document.getElementById('toastMessage');

  const toast = createToast(toastEl);

  // ----- Render de la barra de navegación (pestañas como enlaces) -----
  function renderNav() {
    const nav = document.getElementById('pageNav');
    const groups = [
      { label: 'Diagramas principales', keys: NAV_ORDER.slice(0, 6) },
      { label: 'Vistas por actor y dominio', keys: NAV_ORDER.slice(6, 9) },
      { label: 'Casos de uso y propuestas', keys: NAV_ORDER.slice(9) }
    ];
    const options = groups.map(group => `
      <optgroup label="${group.label}">
        ${group.keys.map(key => `<option value="${DIAGRAM_CONFIGS[key].page}">${NAV_LABELS[key]}</option>`).join('')}
      </optgroup>`).join('');

    nav.innerHTML = `<label class="nav-picker">
      <span class="nav-picker-label">Ir a</span>
      <select class="nav-select" aria-label="Elegir diagrama">${options}</select>
    </label>`;

    const picker = nav.querySelector('.nav-select');
    picker.value = config.page;
    picker.addEventListener('change', () => {
      window.location.href = picker.value;
    });
  }

  // ----- Carga del SVG del diagrama -----
  // Estrategia: 1) versión inline (diagrams/inline/*.svg, sin necesidad de
  // servidor), 2) fallback a fetch del SVG standalone, 3) mensaje de error.
  function injectSvg(svgText) {
    pane.innerHTML = svgText;
    const svg = pane.querySelector('svg');
    if (!svg) return null;
    svg.classList.add('diagram-svg');
    return svg;
  }

  function loadViaFetch() {
    if (typeof fetch !== 'function') return Promise.resolve(null);
    return fetch(config.svgFile)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(injectSvg)
      .catch(() => null);
  }

  function loadDiagramSvg() {
    if (config.inlineSvg) {
      const svg = injectSvg(config.inlineSvg);
      if (svg) return Promise.resolve(svg);
    }
    return loadViaFetch().then((svg) => {
      if (svg) return svg;
      pane.innerHTML = `<div style="padding:2rem;font-family:var(--font-mono);color:#64748b;">
        No se pudo cargar el diagrama (<code>${config.svgFile}</code>).<br>
        Verifica que exista <code>js/diagram-data.js</code> o sirve el
        repositorio con un servidor local, p. ej.:
        <code>python3 -m http.server</code> y abre <code>/pages/${config.page}</code>.
      </div>`;
      return null;
    });
  }

  // ----- Inicialización -----
  renderNav();

  const headerViewLabel = document.getElementById('headerActiveViewLabel');
  headerViewLabel.innerHTML = `VISTA: <span class="view-name">${config.label}</span>`;
  document.title = `${config.title} — ProA La Falda`;

  document.getElementById('infoPanelTitle').textContent = config.infoTitle;

  loadDiagramSvg().then((svg) => {
    if (!svg) return;

    // Zoom / paneo
    const viewport = createViewportController({
      viewport: viewportContainer,
      svg: svg,
      config: config,
      onZoomChange: (text) => { zoomLevelText.textContent = text; }
    });

    document.getElementById('zoomInBtn').addEventListener('click', () => viewport.zoom(0.15));
    document.getElementById('zoomOutBtn').addEventListener('click', () => viewport.zoom(-0.15));
    document.getElementById('resetViewBtn').addEventListener('click', viewport.fitToScreen);

    // Panel de especificación
    const toggleInfoBtn = document.getElementById('toggleInfoBtn');
    const closeInfoBtn = document.getElementById('closeInfoBtn');
    toggleInfoBtn.addEventListener('click', () => {
      infoPanel.classList.toggle('hidden');
      setTimeout(viewport.fitToScreen, 150);
    });
    closeInfoBtn.addEventListener('click', () => {
      infoPanel.classList.add('hidden');
      setTimeout(viewport.fitToScreen, 150);
    });

    // Simulador (solo página de estados)
    const simulatorDock = document.getElementById('simulatorDock');
    const toggleSimulatorBtn = document.getElementById('toggleSimulatorBtn');
    if (config.hasSimulator && simulatorDock) {
      toggleSimulatorBtn.addEventListener('click', () => {
        simulatorDock.classList.toggle('hidden');
      });
      initSimulator({
        stateLabel: document.getElementById('simCurrentStateLabel'),
        addAbsenceBtn: document.getElementById('simAddAbsenceBtn'),
        jumpCritBtn: document.getElementById('simJumpCritBtn'),
        jumpTeaBtn: document.getElementById('simJumpTeaBtn'),
        resetBtn: document.getElementById('simResetCycleBtn'),
        toast: toast
      });
    } else {
      if (toggleSimulatorBtn) toggleSimulatorBtn.classList.add('hidden');
    }

    // Exportación
    document.getElementById('exportSvgBtn').addEventListener('click', () => {
      try {
        exportSvg(svg, config);
        toast.show('Archivo SVG generado.');
      } catch (err) { console.error(err); }
    });

    document.getElementById('exportPngBtn').addEventListener('click', () => {
      toast.show('Renderizando PNG a 300 DPI...');
      try {
        exportPng(svg, config, () => toast.show('PNG 300 DPI generado.'));
      } catch (err) { console.error(err); }
    });

    // Ajuste inicial y al redimensionar la ventana
    requestAnimationFrame(() => viewport.fitToScreen());
    window.addEventListener('resize', () => viewport.fitToScreen());
  });
})();
