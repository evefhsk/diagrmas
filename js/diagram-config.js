/* ============================================================
   js/diagram-config.js — Configuración central de los diagramas.
   Centraliza metadatos (vista, tamaño, exportación), navegación
   e íconos SVG usados en todas las páginas.
   ============================================================ */

/**
 * Configuración por diagrama.
 * `svgFile` es la ruta del SVG standalone (también sirve para el índice).
 */
const DIAGRAM_CONFIGS = {
  states: {
    label: 'Máquina de Estados',
    title: 'Diagrama de Estados — Regularidad Escolar',
    infoTitle: 'UML (Estados Detallado)',
    width: 1750, height: 540, viewBoxX: 20, viewBoxY: 90,
    exportName: 'Diagrama_Estados_B-N',
    svgFile: '../diagrams/estados.svg',
    page: 'estados.html',
    hasSimulator: true,
    description: 'Ciclo de regularidad según Res. Min. 190/18: estados, guardas y efectos.'
  },
  cycle: {
    label: 'Ciclo de Regularidad',
    title: 'Diagrama de Ciclo de Regularidad',
    infoTitle: 'UML (Ciclo Regularidad)',
    width: 1600, height: 650, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Ciclo_Regularidad_B-N',
    svgFile: '../diagrams/ciclo-regularidad.svg',
    page: 'ciclo-regularidad.html',
    hasSimulator: false,
    description: 'Vista de alto nivel del ciclo completo: regularidad, TEA y deserción.'
  },
  activities: {
    label: 'Actividades (Diseño)',
    title: 'Diagrama de Actividades — Registro de Asistencia',
    infoTitle: 'UML (Actividades)',
    width: 1440, height: 1660, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Actividades_B-N',
    svgFile: '../diagrams/actividades.svg',
    page: 'actividades.html',
    hasSimulator: false,
    description: 'Flujo con carriles (swimlanes): Registro de Asistencia Diaria y Cómputo de Faltas.'
  },
  sequence: {
    label: 'Secuencia (Bitácora)',
    title: 'Diagrama de Secuencia — Bitácora Pedagógica',
    infoTitle: 'UML (Secuencia)',
    width: 1200, height: 950, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Secuencia_B-N',
    svgFile: '../diagrams/secuencia.svg',
    page: 'secuencia.html',
    hasSimulator: false,
    description: 'Intercambio de mensajes entre Docente, UI, Controlador y Base de Datos.'
  },
  deployment: {
    label: 'Despliegue Físico (SP5)',
    title: 'Diagrama de Despliegue — Topología de Red',
    infoTitle: 'UML (Despliegue)',
    width: 1960, height: 720, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Despliegue_B-N',
    svgFile: '../diagrams/despliegue.svg',
    page: 'despliegue.html',
    hasSimulator: false,
    description: 'Arquitectura física y distribución de nodos del Sistema Web (SP5 / RUP).'
  },
  components: {
    label: 'Componentes del Sistema',
    title: 'Diagrama de Componentes — ProA La Falda',
    infoTitle: 'UML (Componentes)',
    width: 1200, height: 1100, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Componentes_B-N',
    svgFile: '../diagrams/componentes.svg',
    page: 'componentes.html',
    hasSimulator: false,
    description: 'Arquitectura lógica basada en componentes y base de datos relacional.'
  }
};

/**
 * Contenedor del contenido SVG inline (lo rellena js/diagram-data.js).
 * Así las páginas funcionan también abriéndolas con file:// sin servidor.
 */
const DIAGRAM_SVG = {};

/** Orden de las pestañas en la barra de navegación. */
const NAV_ORDER = ['states', 'cycle', 'activities', 'sequence', 'deployment', 'components'];

/** Íconos (Heroicons outline) usados en la navegación entre páginas. */
const NAV_ICONS = {
  states: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
  cycle: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>',
  activities: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>',
  sequence: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>',
  deployment: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>',
  components: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/>'
};

/** Etiquetas cortas para las pestañas de navegación. */
const NAV_LABELS = {
  states: 'Estados',
  cycle: 'Ciclo Regularidad',
  activities: 'Actividades',
  sequence: 'Secuencia',
  deployment: 'Despliegue',
  components: 'Componentes'
};
