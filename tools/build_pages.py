#!/usr/bin/env python3
"""Genera las páginas por diagrama a partir de una plantilla común.

Uso: python3 tools/build_pages.py
El contenido específico de cada página (título, info, simulador)
queda reflejado en el HTML estructural; los datos dinámicos se
resuelven desde js/diagram-config.js en tiempo de ejecución.
Reemplaza al antiguo diagrmas.html monolítico (sin Tailwind).
"""
import os

TEMPLATE = """<!DOCTYPE html>
<html lang="es" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — Diagramas UML B&N (ProA La Falda)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/layout.css">{extra_css}
</head>
<body data-diagram="{key}">

  <!-- Header -->
  <header class="app-header">
    <div class="header-brand">
      <div class="brand-badge">UML</div>
      <div style="display:flex;flex-direction:column;justify-content:center;">
        <div class="brand-title-row">
          <span class="brand-title">ProA La Falda</span>
          <span class="brand-tag">SP4 / SP5 &bull; RUP</span>
        </div>
        <p id="headerActiveViewLabel" class="header-view-label"></p>
      </div>
    </div>

    <!-- Navegación entre páginas (antes: pestañas dentro de un solo archivo) -->
    <nav id="pageNav" class="page-nav custom-scroll"></nav>

    <!-- Controles -->
    <div class="header-controls">
      <div class="zoom-group">
        <button id="zoomOutBtn" type="button" class="icon-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg></button>
        <span id="zoomLevelText" class="zoom-level">100%</span>
        <button id="zoomInBtn" type="button" class="icon-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg></button>
        <div class="zoom-divider"></div>
        <button id="resetViewBtn" type="button" class="text-btn">Ajustar Vista</button>
      </div>
      {simulator_toggle}
      <button id="toggleInfoBtn" type="button" class="control-btn"><span>Especificación</span></button>
      <button id="exportSvgBtn" type="button" class="control-btn control-btn--svg"><span>SVG</span></button>
      <button id="exportPngBtn" type="button" class="control-btn control-btn--primary"><span class="btn-strong">PNG 300 DPI</span></button>
    </div>
  </header>

  <div class="main-area">
    <div id="viewportContainer" class="viewport">

      <div id="toastMessage" class="toast">
        <span data-toast-icon>&bull;</span>
        <span data-toast-text>Notificación</span>
      </div>

      <!-- Lienzo del diagrama: el SVG se carga desde ../diagrams/{svg} -->
      <div id="diagramPane" class="diagram-pane"></div>
{simulator_dock}
      <div class="footer-note"><a href="../index.html">&larr; Todas las vistas</a></div>
    </div>

    <!-- Panel lateral de especificación -->
    <aside id="infoPanel" class="info-panel custom-scroll hidden">
      <div class="info-panel-header">
        <h2 id="infoPanelTitle" class="info-panel-title">Especificación Formal UML</h2>
        <button id="closeInfoBtn" type="button" class="close-btn"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
      </div>
      <div class="info-content">
        <div class="info-card">
          <h3>{info_title}</h3>
          <p>{info_text}</p>
        </div>
      </div>
    </aside>
  </div>

  <!-- Scripts separados -->
  <script src="../js/diagram-config.js"></script>
  <script src="../js/toast.js"></script>
  <script src="../js/viewport.js"></script>
  <script src="../js/exporter.js"></script>{extra_js}
  <script src="../js/diagram-page.js"></script>
</body>
</html>
"""

SIM_DOCK = """
      <!-- Dock del simulador (solo Máquina de Estados) -->
      <div id="simulatorDock" class="simulator-dock">
        <div class="sim-status">
          <span class="sim-indicator-dot"></span>
          <span id="simCurrentStateLabel" class="sim-current-label">Estado: [Regular] (0 faltas)</span>
        </div>
        <div class="sim-divider"></div>
        <div class="sim-actions">
          <button id="simAddAbsenceBtn" type="button" class="sim-btn">+1 Falta</button>
          <button id="simJumpCritBtn" type="button" class="sim-btn">10 Faltas (Acta)</button>
          <button id="simJumpTeaBtn" type="button" class="sim-btn">25 Faltas (TEA)</button>
          <button id="simPassTeaBtn" type="button" class="sim-btn">Acreditar TEA (&ge; 6)</button>
          <button id="simDropBtn" type="button" class="sim-btn sim-btn--muted">Desvincular</button>
          <button id="simResetCycleBtn" type="button" class="sim-btn sim-btn--reset" title="Reiniciar Ciclo">&circlearrowright;</button>
        </div>
      </div>
"""

PAGES = {
    "states": {
        "file": "estados.html",
        "title": "Diagrama de Estados",
        "svg": "estados.svg",
        "info_title": "Fundamento Normativo (Estados Detallados):",
        "info_text": "Resolución Ministerial N.° 190/18 (Córdoba). Regula la permanencia, el régimen de faltas y el dispositivo pedagógico TEA.",
        "simulator": True,
    },
    "cycle": {
        "file": "ciclo-regularidad.html",
        "title": "Ciclo de Regularidad",
        "svg": "ciclo-regularidad.svg",
        "info_title": "Ciclo de Vida de Regularidad:",
        "info_text": "Diagrama de alto nivel mostrando el ciclo completo del estado del alumno y los caminos posibles de regularidad y deserción.",
        "simulator": False,
    },
    "activities": {
        "file": "actividades.html",
        "title": "Diagrama de Actividades",
        "svg": "actividades.svg",
        "info_title": "Modelado de Proceso de Negocio:",
        "info_text": "Flujo: Registro de Asistencia Diaria y Cómputo de Faltas (SP4 / UML 2.5 - RUP).",
        "simulator": False,
    },
    "sequence": {
        "file": "secuencia.html",
        "title": "Diagrama de Secuencia",
        "svg": "secuencia.svg",
        "info_title": "Interacción de Sistema:",
        "info_text": "Flujo: Registro y Publicación de Bitácora Pedagógica. Muestra el intercambio de mensajes entre el Docente, la Interfaz (UI), el Controlador y la Base de Datos.",
        "simulator": False,
    },
    "deployment": {
        "file": "despliegue.html",
        "title": "Diagrama de Despliegue",
        "svg": "despliegue.svg",
        "info_title": "Arquitectura Física y Despliegue:",
        "info_text": "Modelado SP5 / UML 2.5 - RUP para la topología de red y distribución física del Sistema Web.",
        "simulator": False,
    },
    "components": {
        "file": "componentes.html",
        "title": "Diagrama de Componentes",
        "svg": "componentes.svg",
        "info_title": "Arquitectura Lógica de Software:",
        "info_text": "Diseño basado en componentes para el sistema ProA La Falda. Presenta las tarjetas redondeadas y la base de datos cilíndrica según la estética solicitada.",
        "simulator": False,
    },
}

out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "pages"))
os.makedirs(out_dir, exist_ok=True)

for key, p in PAGES.items():
    html = TEMPLATE.format(
        key=key,
        title=p["title"],
        svg=p["svg"],
        info_title=p["info_title"],
        info_text=p["info_text"],
        extra_css='\n  <link rel="stylesheet" href="../css/simulator.css">' if p["simulator"] else "",
        extra_js='\n  <script src="../js/simulator.js"></script>' if p["simulator"] else "",
        simulator_toggle='<button id="toggleSimulatorBtn" type="button" class="control-btn"><span>Simulador</span></button>' if p["simulator"] else '<button id="toggleSimulatorBtn" type="button" class="control-btn hidden"><span>Simulador</span></button>',
        simulator_dock=SIM_DOCK if p["simulator"] else "",
    )
    path = os.path.join(out_dir, p["file"])
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print("generado:", path)
