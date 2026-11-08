#!/usr/bin/env python3
"""Synchronize inline SVG fallbacks and regenerate js/diagram-data.js."""
import argparse
import json
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SVG_NS = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG_NS)

DIAGRAMS = {
    "activities": "actividades.svg",
    "cycle": "ciclo-regularidad.svg",
    "components": "componentes.svg",
    "deployment": "despliegue.svg",
    "states": "estados.svg",
    "sequence": "secuencia.svg",
}


def read_svg(path):
    root = ET.parse(path).getroot()
    root.attrib.pop("width", None)
    root.attrib.pop("height", None)
    for element in root.iter():
        if element.text and not element.text.strip():
            element.text = None
        if element.tail and not element.tail.strip():
            element.tail = None
    return ET.tostring(root, encoding="unicode", short_empty_elements=True)


def sync_inline():
    inline_dir = ROOT / "diagrams" / "inline"
    for filename in DIAGRAMS.values():
        source = ROOT / "diagrams" / filename
        target = inline_dir / filename
        target.write_text(read_svg(source), encoding="utf-8")


def build_data():
    lines = [
        "/* ============================================================",
        "   js/diagram-data.js — Contenido SVG de los diagramas.",
        "   Generado por tools/build_diagram_data.py desde diagrams/inline/.",
        "   No editar a mano.",
        "   =========================================================== */",
        "",
        "(function () {",
    ]
    for key, filename in DIAGRAMS.items():
        svg = read_svg(ROOT / "diagrams" / "inline" / filename)
        lines.append(f"  DIAGRAM_SVG[{json.dumps(key)}] = {json.dumps(svg, ensure_ascii=False)};")
    lines.extend(["})();", ""])
    (ROOT / "js" / "diagram-data.js").write_text("\n".join(lines), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--sync-inline",
        action="store_true",
        help="refresh diagrams/inline from the standalone diagrams first",
    )
    args = parser.parse_args()
    if args.sync_inline:
        sync_inline()
    build_data()


if __name__ == "__main__":
    main()