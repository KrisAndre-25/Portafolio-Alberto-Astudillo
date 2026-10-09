"""Copies the certificates into public/assets/certificaciones/ with safe names,
renders first-page thumbnails (WebP) and writes their dimensions to
src/data/generated/certificates.json.

Certificates that show the national ID number (RUT) are published as a
rasterized copy with that number covered, so it can't be read or extracted.
Originals are only read, never modified.

    python scripts/generate-cert-thumbs.py

Requires: pip install pypdfium2 pdfplumber pillow
"""

import json
import re
import shutil
from pathlib import Path

import pdfplumber
import pypdfium2 as pdfium
from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Certificaciones" / "Certificaciones"
OUT = ROOT / "public" / "assets" / "certificaciones"
MANIFEST = ROOT / "src" / "data" / "generated" / "certificates.json"

# slug -> original file name. Titles live in src/data/certificates.ts.
FILES = {
    "titulo-tecnico-turismo-aventura": "TITULO TURISMO AVENTURA.pdf",
    "guia-de-turismo": "Certificado Guía de turismo.pdf",
    "primeros-auxilios-lugares-remotos": "Certificado Aider.pdf",
    "credencial-primeros-auxilios-lugares-remotos": "Credencial Aider.pdf",
    "biodiversidad-conservacion-humedales": "Curso Humedales.pdf",
    "glaciares-chilenos": "Certificado Glaciares Chilenos-3 (1).pdf",
    "introduccion-derecho-ambiental": "Certificados derecho ambiental juntos-1 (1).pdf",
    "sociologia-del-antropoceno": "Certificados sociología del antropoceno-2 (1).pdf",
    "academia-liderazgo-juventudes-protagonistas": "Juventudes Protagonistas.png",
    "capacitacion-no-discriminacion": "Certificado Capacitación No Discriminación Juegos Parapanamericanos Santiago 2023 Alberto Andrés Astudillo Venegas.pdf",
    "capacitacion-voluntariado-santiago-2023": "Diploma Panamericanos -Alberto Andres Astudillo Venegas (1).pdf",
    "participacion-santiago-2023": "Certificado Participacion Santiago2023.pdf",
    "inspector-educacional": "Certificado Diploma Inspector Educacional.pdf",
}

# Matches the RUT with or without dots ("19.002.249-8", "19002249-8").
RUT = re.compile(r"\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]")
RENDER_SCALE = 2  # 144 dpi for the redacted copies
THUMBS = {"md": 900, "sm": 420}


def rut_boxes(pdf_path: Path) -> list[tuple[float, float, float, float]]:
    with pdfplumber.open(pdf_path) as pdf:
        page = pdf.pages[0]
        return [
            (w["x0"] - 2, w["top"] - 2, w["x1"] + 2, w["bottom"] + 2)
            for w in page.extract_words()
            if RUT.search(w["text"])
        ]


def render(pdf_path: Path, boxes, scale: float) -> Image.Image:
    page = pdfium.PdfDocument(pdf_path)[0]
    img = page.render(scale=scale).to_pil().convert("RGB")
    draw = ImageDraw.Draw(img)
    for x0, top, x1, bottom in boxes:
        draw.rectangle([x0 * scale, top * scale, x1 * scale, bottom * scale], fill="white")
    return img


def trim_white(img: Image.Image, pad: int = 24) -> Image.Image:
    """Crops page margins so small documents (an ID card on an A4 page) fill the thumbnail."""
    diff = ImageChops.difference(img, Image.new("RGB", img.size, "white")).convert("L")
    box = diff.point(lambda v: 255 if v > 18 else 0).getbbox()
    if not box:
        return img
    x0, y0, x1, y1 = box
    return img.crop((max(x0 - pad, 0), max(y0 - pad, 0), min(x1 + pad, img.width), min(y1 + pad, img.height)))


def thumbs(img: Image.Image, slug: str) -> dict:
    variants = {}
    img = trim_white(img)
    for key, width in THUMBS.items():
        t = img.copy()
        t.thumbnail((width, width * 2))
        out = OUT / f"{slug}-{key}.webp"
        t.save(out, "WEBP", quality=78, method=6)
        variants[key] = {"src": f"/assets/certificaciones/{out.name}", "width": t.width, "height": t.height}
    return variants


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for slug, name in FILES.items():
        src = SRC / name
        entry: dict = {"original": name}
        if src.suffix.lower() == ".pdf":
            boxes = rut_boxes(src)
            img = render(src, boxes, RENDER_SCALE)
            out = OUT / f"{slug}.pdf"
            if boxes:
                # Rasterize so the covered number is gone, not just hidden.
                img.save(out, "PDF", resolution=72 * RENDER_SCALE, quality=85)
            else:
                shutil.copyfile(src, out)
            entry.update(type="pdf", file=f"/assets/certificaciones/{out.name}", redacted=bool(boxes))
        else:
            img = Image.open(src).convert("RGB")
            out = OUT / f"{slug}.webp"
            full = img.copy()
            full.thumbnail((2000, 2000))
            full.save(out, "WEBP", quality=85, method=6)
            entry.update(type="image", file=f"/assets/certificaciones/{out.name}", redacted=False)
        entry["width"], entry["height"] = img.size
        entry["thumb"] = thumbs(img, slug)
        manifest[slug] = entry
        print(f"{slug:48} {'REDACTED' if entry['redacted'] else ''}")

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf8")


if __name__ == "__main__":
    main()
