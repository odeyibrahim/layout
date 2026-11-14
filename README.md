# Brand Studio

Mobile-first design tool for business content: posts, documents, 80-page brand kits and decks. Everything stays in the browser.

## What is in here
- `public/index.html`: **the main app** (Layout Studio engine, v93): scene editor with undo, layers, guides, vector PDF, zip export, industry briefs and the 80-page Ray of Light kit, installable as a PWA.
- `public/lite/`: a small, simpler companion (open at `/lite/`): finished-sample start, photos with filters, one-tap Resize, node editing, industry wording and PDF. Kept as a reference for the simpler flow to port into the main app.

## Run / test / deploy
    npm run dev      # serves ./public
    npm test         # unit tests for the lite app's geometry and PDF
Deploy: push to GitHub, import in Netlify, build command empty, publish directory `public` (set in `netlify.toml`). Bump `V` in `public/sw.js` to ship updates.

## New in this build (main app)
First launch now opens a finished sample brand kit (80 pages) instead of a blank page. Page menu and command palette have **Resize to…**: makes a scaled copy of the page at another preset size (undoable).

## Photo adjust (main app)
Select an image: Light, Contrast and Colour fields plus Natural / Mono / Punchy in the Image section. Uses canvas filters, so it shows in PNG export; browsers without canvas filter support (older Safari) ignore it.

## Drawing (main app)
Add → Shape → **Pen (Bézier)** or **Brush**, or the command palette. A small bar gives Pen / Brush / Eraser, colour, size, Done and Exit. Pen: tap to place a point, drag to curve it, tap the first point to close, Done to finish. Brush: freehand, auto-smoothed into curves. Eraser: tap a drawn path to delete it. Drawings are vector `path` elements: they move, resize, undo and export like any other element, and the inspector has stroke colour, width and opacity. Photo Light/Contrast/Colour now also preview live on screen.

## Known gaps
Editing the points of an existing path (only in `lite/`), brush pressure/taper, fill for drawn shapes, gradients, background cut-out, perspective warp, path booleans, bundled fonts, cloud sync.
