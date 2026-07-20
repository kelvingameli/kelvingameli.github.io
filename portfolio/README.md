# Kelvin Gameli Enam — Portfolio

A futuristic, lab-inspired academic portfolio for a Medical Laboratory Science student
building expertise in laboratory medicine, biomedical research, genetics, and data
science — working toward a future career in cardiothoracic surgery.

Built with plain HTML + Tailwind CSS + vanilla JavaScript. No frameworks, no backend.

## Project structure

```
portfolio/
├── index.html                 ← THE SITE (self-contained, deploy this)
├── assets/
│   ├── Kelvin_Gameli_Enam_CV.pdf   ← REPLACE with your real CV (same filename)
│   ├── img/                   ← source images (also embedded into index.html)
│   ├── fonts/                 ← self-hosted woff2 fonts (also embedded)
│   ├── css/styles.css         ← compiled Tailwind output
│   └── js/main.js             ← site JavaScript (also embedded)
├── src/
│   ├── index.source.html      ← editable HTML source (references assets/)
│   ├── input.css              ← Tailwind + custom design-system CSS
│   └── build_single.py        ← generates the self-contained index.html
└── tailwind.config.js
```

`index.html` is fully self-contained (CSS, JS, fonts, and images are inlined) so it
works anywhere — including offline — straight out of the box. The only external file
it needs is `assets/Kelvin_Gameli_Enam_CV.pdf` for the CV buttons.

## Deploying to GitHub Pages

1. Create a repository, e.g. `username.github.io` (or any repo name).
2. Upload `index.html` and the `assets/` folder.
3. In the repo: **Settings → Pages → Deploy from a branch → main → / (root)**.
4. Your site goes live at `https://username.github.io/`.

## Things to personalize

| What | Where |
|---|---|
| Your real CV | Replace `assets/Kelvin_Gameli_Enam_CV.pdf` |
| Email address | Search `kelvin.gameli.enam@gmail.com` in `index.html` (appears in the contact section and the form's `data-recipient`) |
| LinkedIn / GitHub URLs | Search `linkedin.com/in/kelvin-gameli-enam` and `github.com/kelvingamelienam` |
| ORCID link | A ready-made ORCID block is commented out in the Contact section — uncomment it and add your iD once registered |
| Photos | Put new files in `assets/img/` and re-run the build (below), or paste a new data URI |

## Rebuilding after edits

For quick text/content edits, editing `index.html` directly is fine.

For image/style/JS changes, edit the sources and rebuild (requires Node.js):

```bash
npm install            # first time only
npm run build          # recompiles Tailwind → assets/css/styles.css
python3 src/build_single.py   # regenerates the self-contained index.html
```

- Content/markup source: `src/index.source.html`
- Design system (colors, ECG animation, glass effects): `src/input.css` + `tailwind.config.js`

## Notes

- The contact form has no backend (GitHub Pages is static): it opens the visitor's
  email app pre-filled with their message, and says so on the page.
- Fonts (Manrope, Inter, JetBrains Mono) are self-hosted for privacy and reliability.
- Accessibility: skip link, semantic landmarks, focus styles, `prefers-reduced-motion`
  support, and labelled form controls are built in.
