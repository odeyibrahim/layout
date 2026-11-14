# Brand Studio

Mobile-first tool for making on-brand posts, stories, quotes and invoices. Set your brand once, tap what you need, edit in place, add photos with light/contrast/colour and one-tap filters, resize any design to another format, draw with a vector pen or brush, and share a PNG. No build step, no framework, no server: everything stays in the browser (localStorage).

## Run locally
    npm run dev      # serves ./public (needs Node 18+)
    npm test         # geometry unit tests

## Deploy (GitHub + Netlify)
1. Create a GitHub repo and push this folder.
2. In Netlify: **Add new site → Import from Git**, pick the repo. Build command: leave empty. Publish directory: `public` (already set in `netlify.toml`, which also adds the security headers and CSP).
3. Deploy. The app is installable as a PWA and works offline after the first visit.
To ship an update, bump `V` in `public/sw.js` so phones pick up the new files.

## Supabase
Not used and not needed. Add it later only if you want accounts or cloud sync of designs. Loosen `connect-src` in `netlify.toml` to your Supabase URL when you do.

## Layout
    public/index.html  app shell        public/app.js  state, UI, drawing, export
    public/geom.js     pure path maths  public/sw.js   offline cache
    tests/             unit tests       netlify.toml   deploy config

## Not built yet
Cut-out and perspective warp, industry copy library, bundled fonts, vector PDF, brush pressure/taper, node editing, gradients, path booleans, pinch zoom, PNG app icons.
