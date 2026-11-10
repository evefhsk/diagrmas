# Diagramas UML B&N — ProA La Falda (repositorio reorganizado)

Reorganización del antiguo `diagrmas.html` monolítico (13 vistas + ~380 líneas
de JavaScript + estilos embebidos) en un sitio estático modular: **una página
por pestaña**, hojas de estilo CSS separadas, scripts separados por
responsabilidad y los diagramas como archivos SVG independientes.

Este repositorio es un visor de diagramas UML y un simulador conceptual de
estados. La aplicación operativa de asistencia y la integración propuesta con
Classroom se describen en los modelos, pero no están implementadas aquí.

## Estructura

```
.
├── index.html                  # Página de índice: selector de diagramas
├── pages/                      # Una página por diagrama
│   ├── estados.html            # Máquina de Estados (+ simulador interactivo)
│   ├── ciclo-regularidad.html  # Ciclo de Regularidad Escolar
│   ├── actividades.html        # Diagrama de Actividades (swimlanes)
│   ├── secuencia.html          # CU-02: publicación de bitácora por Docente
│   ├── secuencia-consulta.html # CU-03: consulta personal por Estudiante
│   ├── secuencia-ausentes.html # RF-08: filtro y transcripción manual
│   ├── despliegue.html         # Diagrama de Despliegue (SP5)
│   ├── componentes.html        # Diagrama de Componentes
│   ├── clases-dominio.html     # Modelo del dominio académico
│   ├── casos-uso.html          # Casos de Uso (vista general)
│   ├── caso-uso-asistencia.html # CU-01: Asistencia y tardanzas
│   ├── caso-uso-bitacora.html   # CU-02: Bitácora de clase
│   ├── caso-uso-consulta.html   # CU-03: Consulta de bitácora
│   ├── caso-uso-auditoria.html    # CU-04: Auditoría y regularidad
│   ├── caso-uso-comunicacion.html # RF-09: Consultas pedagógicas (propuesta)
│   └── caso-uso-classroom.html    # RF-10: portal complementario de Classroom
├── css/
│   ├── base.css                # Variables del tema, tipografías, utilidades
│   ├── layout.css              # Header, navegación, viewport, toast, panel lateral
│   ├── index.css               # Estilos de la página de índice
│   └── simulator.css           # Dock del simulador + resaltado de estados/transiciones
├── js/
│   ├── diagram-config.js       # Configuración central (tamaños, rutas, íconos, textos)
│   ├── toast.js                # Notificaciones flotantes
│   ├── viewport.js             # Zoom (rueda/botones), paneo y "ajustar a pantalla"
│   ├── exporter.js             # Exportación a SVG y PNG 300 DPI
│   ├── simulator.js            # Simulador de la máquina de estados (faltas → TEA)
│   └── diagram-page.js         # Controller común de cada página de diagrama
├── diagrams/                   # SVGs independientes originales y agregados
│   ├── estados.svg
│   ├── ciclo-regularidad.svg
│   ├── actividades.svg
│   ├── secuencia.svg
│   ├── despliegue.svg
│   ├── componentes.svg
│   ├── clases-dominio.svg
│   ├── secuencia-consulta.svg
│   └── secuencia-ausentes.svg
│   ├── casos-uso-general.svg
│   ├── caso-uso-asistencia.svg
│   ├── caso-uso-bitacora.svg
│   ├── caso-uso-consulta.svg
│   ├── caso-uso-auditoria.svg
│   ├── caso-uso-comunicacion.svg
│   └── caso-uso-classroom.svg
├── tools/
│   └── build_pages.py          # Regenera las páginas desde la plantilla común
└── legacy/
    └── diagrmas.html           # Archivo original conservado como referencia
```

## Cómo ejecutar

Los diagramas se cargan con `fetch()`, por lo que se necesita un servidor HTTP
local (no funciona abriendo los archivos con `file://`):

```bash
python3 -m http.server 8000
# Abrir http://localhost:8000/index.html  (o directamente pages/estados.html)
```

## Funcionalidad conservada

- Navegación entre las 16 vistas, agrupadas en diagramas principales, vistas por
  actor/dominio y casos de uso; la opción activa se conserva al cambiar de página.
- Zoom con rueda centrado en el cursor, botones +/−, "Ajustar Vista", paneo
  por arrastre.
- Panel lateral "Especificación" con el texto propio de cada diagrama.
- Simulador de estados (solo en `pages/estados.html`): +1 falta, saltos a
  Acta/TEA y reinicio de la simulación, con resaltado de nodos y transiciones.
- Exportación del diagrama actual a **SVG** y **PNG a 300 DPI**.

## Revisión de las fuentes

- La notación se contrastó con la especificación formal [OMG UML 2.5.1](https://www.omg.org/spec/UML/2.5.1/), §§18.1.3.2–18.1.4: casos como elipses, sujeto del sistema como rectángulo y actores como figuras de línea. `include` se reserva para comportamiento obligatorio reutilizable; `extend` parte del caso extensor y requiere un punto de extensión.
- Los diagramas específicos muestran el objetivo del actor en una elipse. Los pasos de flujo y excepciones se conservan en el panel de especificación, no como casos de uso separados.
- El informe de tesis describe el relevamiento del proceso actual (As-Is). El
  análisis de la materia especifica el sistema propuesto; los casos de uso de
  esta app representan ese modelo propuesto, no el proceso vigente.
- El análisis detalla CU-01 a CU-04. RF-07 queda asociado al registro docente y
  la consulta estudiantil; RF-08 queda en CU-01 como filtro de ausentes para
  carga manual, sin transferencia automática a SGE/CiDi.
- El RF-02 original superpone `> 20 min = 0,50` con `>= 40 min = 1,00`. La
  corrección propone 21–39 min para 0,50, pendiente de aprobación de Dirección.
- RF-03 enumera alertas en 3, 5, 10 y 20 faltas; CU-04 menciona 10, 20 y 25.
  Debe distinguirse el umbral de alertas del pase a TEA, que RF-04/RN-03 fijan
  en 25 faltas.
- Los actores CU-04 (Coordinación y Dirección) no aparecen en la lista RBAC,
  que solo enumera Administrador, Preceptor, Docente y Estudiante. Unificar los
  roles con los permisos previstos.
- Los PDF revisados no contienen una devolución explícita del profesor. Para
  incorporar sus correcciones puntuales hace falta contar con esa devolución.
- RF-09 (consultas pedagógicas) es propuesta por validar. RF-10 propone un portal
  complementario de lectura/enlaces: Classroom conserva tareas, entregas y notas
  oficiales; una entrega se abre en Classroom y no se sincroniza desde el portal.
- La API de Classroom permite consultar tareas y estados propios autorizados con
  OAuth. La disponibilidad depende de los permisos de Workspace y de la
  autorización/verificación aplicable.
- La [documentación de Algebraix](https://www.algebraix.com/faq) anuncia la
  importación de actividades y calificaciones desde Classroom; el [aviso de
  privacidad de SISGA](https://www.sisga.com.co/PoliticaPrivacidad.html) declara
  el uso de APIs de Google para Classroom y Drive. Ninguna fuente identifica los
  scopes OAuth ni las llamadas REST concretas. No atribuirles `courses.list` o
  `courseWork.list` sin evidencia de producto.
- La [guía de Google para integraciones SIS](https://developers.google.com/workspace/classroom/sis-integrations/validate-your-SIS)
  describe otra vía basada en OneRoster 1.2 y pruebas de conformidad. Esto no
  demuestra compatibilidad del SGE/CiDi de Córdoba ni que Algebraix o SISGA usen
  esa vía.

## Cambios respecto del original

- Se eliminó la dependencia del CDN de Tailwind: el diseño ahora vive en los
  archivos de `css/` (misma estética slate/B&N).
- Los SVG dejaron de estar incrustados en el HTML: viven en `diagrams/` y se
  inyectan en el lienzo al cargar la página.
- El script único de ~380 líneas se dividió en módulos pequeños (`js/`).
- Para regenerar/mover páginas: editar `tools/build_pages.py` y ejecutar
  `python3 tools/build_pages.py`.
