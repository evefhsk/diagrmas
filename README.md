# Diagramas UML B&N — ProA La Falda (repositorio reorganizado)

Reorganización del antiguo `diagrmas.html` monolítico (6 pestañas + ~380 líneas
de JavaScript + estilos embebidos) en un sitio estático modular: **una página
por pestaña**, hojas de estilo CSS separadas, scripts separados por
responsabilidad y los diagramas como archivos SVG independientes.

## Estructura

```
.
├── index.html                  # Página de índice: selector de diagramas
├── pages/                      # Una página por pestaña original
│   ├── estados.html            # Máquina de Estados (+ simulador interactivo)
│   ├── ciclo-regularidad.html  # Ciclo de Regularidad Escolar
│   ├── actividades.html        # Diagrama de Actividades (swimlanes)
│   ├── secuencia.html          # Diagrama de Secuencia (Bitácora)
│   ├── despliegue.html         # Diagrama de Despliegue (SP5)
│   └── componentes.html        # Diagrama de Componentes
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
├── diagrams/                   # Cada SVG extraído del HTML original (standalone)
│   ├── estados.svg
│   ├── ciclo-regularidad.svg
│   ├── actividades.svg
│   ├── secuencia.svg
│   ├── despliegue.svg
│   └── componentes.svg
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

- Navegación entre las 6 vistas (ahora son enlaces a páginas separadas; la
  pestaña activa se resalta según `body[data-diagram]`).
- Zoom con rueda centrado en el cursor, botones +/−, "Ajustar Vista", paneo
  por arrastre.
- Panel lateral "Especificación" con el texto propio de cada diagrama.
- Simulador de estados (solo en `pages/estados.html`): +1 falta, saltos a
  Acta/TEA, acreditar/desvincular y reinicio del ciclo, con resaltado de
  nodos y transiciones.
- Exportación del diagrama actual a **SVG** y **PNG a 300 DPI**.

## Cambios respecto del original

- Se eliminó la dependencia del CDN de Tailwind: el diseño ahora vive en los
  archivos de `css/` (misma estética slate/B&N).
- Los SVG dejaron de estar incrustados en el HTML: viven en `diagrams/` y se
  inyectan en el lienzo al cargar la página.
- El script único de ~380 líneas se dividió en módulos pequeños (`js/`).
- Para regenerar/mover páginas: editar `tools/build_pages.py` y ejecutar
  `python3 tools/build_pages.py`.
