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
      "useCases": {
        "file": "casos-uso.html",
        "title": "Diagrama General de Casos de Uso",
        "svg": "casos-uso-general.svg",
        "info_title": "Alcance funcional documentado:",
        "info_text": "RF-01 a RF-04 corresponden a asistencia, tardanzas, alertas y TEA; CU-02 y CU-03 describen la bitácora; RF-07 documenta registro docente y consulta estudiantil de calificaciones. RF-08 exige archivos para SGE/CiDi, pero el análisis no identifica quién inicia ese caso. Tutores y familias no tienen acceso web en esta etapa.",
        "simulator": False,
      },
      "useCaseAttendance": {
        "file": "caso-uso-asistencia.html",
        "title": "Caso de Uso CU-01 — Registrar Asistencia y Gestionar Alertas",
        "svg": "caso-uso-asistencia.svg",
        "info_title": "CU-01 · Registrar asistencia y gestionar alertas de regularidad:",
        "info_text": "Actor principal: Preceptoría; secundaria: Dirección para el seguimiento de alertas y actas. Precondición: sesión autenticada y turno activo. Flujo: seleccionar curso/división, revisar la nómina, registrar ausencias, tardanzas y retiros; confirmar. El sistema calcula la fracción, actualiza el acumulado y notifica los hitos 3, 5, 10 y 20 a Preceptoría y Dirección. Preceptoría revisa las alertas y gestiona las actas precompletadas en 10 y 20; Dirección y tutores participan de la firma presencial. Al alcanzar 25, el sistema deriva a TEA y notifica a Coordinación. Rectificaciones/justificaciones dentro de 48 horas hábiles con auditoría. Regla por validar: hasta 20 min = 0,25; 21–39 = 0,50; desde 40 = 1,00.",
        "simulator": False,
      },
      "useCaseLogbook": {
        "file": "caso-uso-bitacora.html",
        "title": "Caso de Uso CU-02 — Gestionar Bitácora y Evaluaciones",
        "svg": "caso-uso-bitacora.svg",
        "info_title": "CU-02 · Registrar bitácora y hacer seguimiento de actividades y evaluaciones:",
        "info_text": "Precondición: docente autenticado y asignado al espacio curricular. Flujo: seleccionar espacio y curso; publicar fecha, tema, actividad, recursos y tareas con fecha límite; consultar por actividad quién entregó, quién tiene entregas pendientes y quién está atrasado; registrar calificaciones cuantitativas o cualitativas y devoluciones. Para una entrega desaprobada, la retroalimentación es obligatoria; el sistema permite consultar promedios provisionales (RF-07). Error: ante campos obligatorios incompletos, solicita completarlos antes de guardar.",
        "simulator": False,
      },
      "useCaseConsultation": {
        "file": "caso-uso-consulta.html",
        "title": "Caso de Uso CU-03 — Consultar Bitácora y Seguimiento Académico",
        "svg": "caso-uso-consulta.svg",
        "info_title": "CU-03 · Consultar clases, entregas y calificaciones:",
        "info_text": "Precondición: estudiante autenticado. Flujo: ingresar a Mis Clases/Bitácora, filtrar por asignatura, fecha o actividad; consultar clases y materiales, las fechas límite y el estado de sus entregas (entregada, pendiente o atrasada); revisar las calificaciones cuantitativas o cualitativas, la retroalimentación docente y los promedios provisionales disponibles.",
        "simulator": False,
      },
      "useCaseAudit": {
        "file": "caso-uso-auditoria.html",
        "title": "Caso de Uso CU-04 — Auditar Avance y Regularidad",
        "svg": "caso-uso-auditoria.svg",
        "info_title": "CU-04 · Auditar avance pedagógico, seguimiento de entregas y regularidad:",
        "info_text": "Actores: Coordinación Pedagógica y Dirección, con permisos por definir en RBAC. Flujo: consultar el semáforo de bitácoras por asignatura, el estado de entregas pendientes o atrasadas y resúmenes de calificaciones para detectar necesidades de acompañamiento; revisar estudiantes con alertas de regularidad y emitir una ficha de intervención al seleccionar un estudiante TEA. El CU fuente enumera 10, 20 y 25 inasistencias; RF-04/RN-03 fijan el pase a TEA en 25. Esta vista es de supervisión y no reemplaza la carga de calificaciones a cargo del docente.",
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
