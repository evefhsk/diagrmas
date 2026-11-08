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
    width: 1750, height: 590, viewBoxX: 20, viewBoxY: 40,
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
    width: 1440, height: 1700, viewBoxX: 0, viewBoxY: 0,
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
  sequenceConsultation: {
    label: 'Secuencia (Estudiante)',
    title: 'Secuencia CU-03 — Consulta de Bitácora',
    infoTitle: 'CU-03 · Consulta del Estudiante:',
    width: 1200, height: 920, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Secuencia_CU-03_Consulta',
    svgFile: '../diagrams/secuencia-consulta.svg',
    page: 'secuencia-consulta.html',
    hasSimulator: false,
    description: 'Consulta de bitácoras publicadas y del estado personal de entregas y calificaciones.'
  },
  sequenceAbsences: {
    label: 'Secuencia (Ausentes)',
    title: 'Secuencia RF-08 — Filtro de Ausentes',
    infoTitle: 'RF-08 · Consulta de Preceptoría:',
    width: 1400, height: 860, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Secuencia_RF-08_Filtro_Ausentes',
    svgFile: '../diagrams/secuencia-ausentes.svg',
    page: 'secuencia-ausentes.html',
    hasSimulator: false,
    description: 'Filtro de asistencia confirmada y transcripción manual al sistema provincial, sin integración.'
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
  },
  domainClasses: {
    label: 'Clases del Dominio',
    title: 'Diagrama de Clases del Dominio',
    infoTitle: 'Modelo de dominio y control:',
    width: 1700, height: 1420, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Clases_Dominio',
    svgFile: '../diagrams/clases-dominio.svg',
    page: 'clases-dominio.html',
    hasSimulator: false,
    description: 'Identidad, RBAC, auditoría y entidades académicas.'
  },
  useCases: {
    label: 'Casos de Uso (General)',
    title: 'Diagrama General de Casos de Uso',
    infoTitle: 'Alcance funcional documentado:',
    width: 2000, height: 1180, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_Casos_de_Uso_General',
    svgFile: '../diagrams/casos-uso-general.svg',
    page: 'casos-uso.html',
    hasSimulator: false,
    description: 'Alcance actual y propuestas RF-09 (consultas) y RF-10 (portal de lectura complementario a Classroom).'
  },
  useCaseAttendance: {
    label: 'CU-01 Asistencia',
    title: 'Caso de Uso CU-01 — Registrar Asistencia',
    infoTitle: 'CU-01 · Registrar asistencia diaria y tardanzas:',
    width: 1400, height: 1000, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_CU-01_Asistencia',
    svgFile: '../diagrams/caso-uso-asistencia.svg',
    page: 'caso-uso-asistencia.html',
    hasSimulator: false,
    description: 'Detalle del registro de presentismo, tardanzas, cálculo fraccionado y acumulados.'
  },
  useCaseLogbook: {
    label: 'CU-02 Bitácora',
    title: 'Caso de Uso CU-02 — Registrar Bitácora',
    infoTitle: 'CU-02 · Registrar bitácora de clase:',
    width: 1400, height: 1000, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_CU-02_Bitacora',
    svgFile: '../diagrams/caso-uso-bitacora.svg',
    page: 'caso-uso-bitacora.html',
    hasSimulator: false,
    description: 'Detalle de la carga, validación y publicación de bitácoras por el docente.'
  },
  useCaseConsultation: {
    label: 'CU-03 Consulta',
    title: 'Caso de Uso CU-03 — Consultar Bitácora',
    infoTitle: 'CU-03 · Consultar bitácora y clases anteriores:',
    width: 1400, height: 1000, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_CU-03_Consulta_Bitacora',
    svgFile: '../diagrams/caso-uso-consulta.svg',
    page: 'caso-uso-consulta.html',
    hasSimulator: false,
    description: 'Detalle de la consulta de clases y acceso a materiales por el estudiante.'
  },
  useCaseAudit: {
    label: 'CU-04 Auditoría',
    title: 'Caso de Uso CU-04 — Auditar Avance y Regularidad',
    infoTitle: 'CU-04 · Auditar avance pedagógico y alertas:',
    width: 1400, height: 1000, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_CU-04_Auditoria',
    svgFile: '../diagrams/caso-uso-auditoria.svg',
    page: 'caso-uso-auditoria.html',
    hasSimulator: false,
    description: 'Detalle de la supervisión de bitácoras, alertas y emisión de ficha TEA.'
  },
  useCaseCommunication: {
    label: 'CU-05 Consultas',
    title: 'CU-05 / RF-09 — Comunicación Pedagógica',
    infoTitle: 'CU-05 / RF-09 · Propuesta de comunicación pedagógica:',
    width: 1400, height: 1000, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_RF-09_Comunicacion_Pedagogica',
    svgFile: '../diagrams/caso-uso-comunicacion.svg',
    page: 'caso-uso-comunicacion.html',
    hasSimulator: false,
    description: 'Consultas asincrónicas entre estudiantes y docentes asociadas a un curso o actividad.'
  },
  useCaseClassroom: {
    label: 'RF-10 Portal Classroom',
    title: 'RF-10 — Portal complementario de Classroom',
    infoTitle: 'RF-10 · Consulta y acceso a tareas oficiales:',
    width: 1700, height: 1100, viewBoxX: 0, viewBoxY: 0,
    exportName: 'Diagrama_RF-10_Portal_Classroom',
    svgFile: '../diagrams/caso-uso-classroom.svg',
    page: 'caso-uso-classroom.html',
    hasSimulator: false,
    description: 'Consulta de tareas y estados propios autorizados; Classroom conserva la entrega y nota oficial.'
  }
};

/**
 * Contenedor del contenido SVG inline (lo rellena js/diagram-data.js).
 * Así las páginas funcionan también abriéndolas con file:// sin servidor.
 */
const DIAGRAM_SVG = {};

/** Orden de las pestañas en la barra de navegación. */
const NAV_ORDER = ['states', 'cycle', 'activities', 'sequence', 'deployment', 'components', 'sequenceConsultation', 'sequenceAbsences', 'domainClasses', 'useCases', 'useCaseAttendance', 'useCaseLogbook', 'useCaseConsultation', 'useCaseAudit', 'useCaseCommunication', 'useCaseClassroom'];

/** Íconos (Heroicons outline) usados en la navegación entre páginas. */
const NAV_ICONS = {
  states: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
  cycle: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>',
  activities: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>',
  sequence: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>',
  sequenceConsultation: '<circle cx="10.5" cy="10.5" r="6.5" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M16 16l4 4"/>',
  sequenceAbsences: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12l4 4L19 6"/>',
  deployment: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>',
  components: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z"/>',
  domainClasses: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16M4 12h16M4 19h16M8 3v4m8-4v4M8 10v4m8-4v4M8 17v4m8-4v4"/>',
  useCases: '<circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M8 12h8m-4-4v8"/>',
  useCaseAttendance: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12l4 4L19 6"/>',
  useCaseLogbook: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  useCaseConsultation: '<circle cx="10.5" cy="10.5" r="6.5" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M16 16l4 4"/>',
  useCaseAudit: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7"/>',
  useCaseCommunication: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16v11H8l-4 4zM8 9h8m-8 4h5"/>',
  useCaseClassroom: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h4"/>'
};

/** Etiquetas cortas para las pestañas de navegación. */
const NAV_LABELS = {
  states: 'Estados',
  cycle: 'Ciclo Regularidad',
  activities: 'Actividades',
  sequence: 'Secuencia',
  sequenceConsultation: 'Secuencia Estudiante',
  sequenceAbsences: 'Secuencia Ausentes',
  deployment: 'Despliegue',
  components: 'Componentes',
  domainClasses: 'Clases del Dominio',
  useCases: 'Casos de Uso',
  useCaseAttendance: 'CU-01 Asistencia',
  useCaseLogbook: 'CU-02 Bitácora',
  useCaseConsultation: 'CU-03 Consulta',
  useCaseAudit: 'CU-04 Auditoría',
  useCaseCommunication: 'CU-05 Consultas',
  useCaseClassroom: 'RF-10 Classroom'
};
