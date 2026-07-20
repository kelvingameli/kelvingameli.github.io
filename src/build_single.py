#!/usr/bin/env python3
"""
Builds the self-contained index.html from src/index.source.html.

Usage (from the project root):
    python3 src/build_single.py

Inlines: fonts (as data URIs), compiled Tailwind CSS, JS, and images.
Edit src/index.source.html + src/input.css, then run:
    npm run build && python3 src/build_single.py
"""
import base64
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode()


def main() -> None:
    html = (ROOT / "src/index.source.html").read_text()

    # --- Inline fonts.css with woff2 embedded as data URIs (deduped) ---
    fonts_css = (ROOT / "assets/css/fonts.css").read_text()
    cache: dict = {}

    def font_repl(match: re.Match) -> str:
        rel = match.group(1).replace("../", "assets/")
        if rel not in cache:
            cache[rel] = f"data:font/woff2;base64,{b64(ROOT / rel)}"
        return f"url({cache[rel]})"

    fonts_inline = re.sub(r"url\((\.\./fonts/[^)]+)\)", font_repl, fonts_css)

    # --- Combine fonts + compiled Tailwind into one <style> block ---
    styles = (ROOT / "assets/css/styles.css").read_text()
    style_block = "<style>\n" + fonts_inline + "\n" + styles + "\n</style>"
    html = html.replace(
        '  <link rel="stylesheet" href="assets/css/fonts.css">\n'
        '  <link rel="stylesheet" href="assets/css/styles.css">',
        "  " + style_block,
    )

    # --- Inline JS ---
    js = (ROOT / "assets/js/main.js").read_text()
    html = html.replace(
        '<script src="assets/js/main.js" defer></script>',
        "<script>\n" + js + "\n</script>",
    )

    # --- Inline images as data URIs ---
    for img in [
        "portrait.jpg",
        "cv-preview.jpg",
        "scientific-visualizations.jpg",
        "research-presentations.jpg",
        "design-projects.jpg",
    ]:
        html = html.replace(
            f'src="assets/img/{img}"',
            f'src="data:image/jpeg;base64,{b64(ROOT / "assets/img" / img)}"',
        )

    (ROOT / "index.html").write_text(html)
    print(f"index.html written: {len(html) // 1024} KB")


if __name__ == "__main__":
    main()
