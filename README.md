# VELOURA — The Beauty Atelier

A luxury one-page template for salons & makeup artists. Pure HTML/CSS/JS — no build
step, no backend. All booking happens over WhatsApp.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Deploy by dragging the folder into Netlify Drop, or push to GitHub Pages / Vercel.

## Re-skin for a new client (15 minutes)

1. **WhatsApp number & messages** — `js/config.js` (one place, used everywhere).
2. **Name, prices, services, copy** — edit the text in `index.html`. Service rows
   carry `data-service="..."`; that name is inserted into the WhatsApp message.
3. **Colors & fonts** — the tokens at the top of `css/style.css` (`--noir`,
   `--porcelain`, `--rouge`, `--champagne`…). Change five hex values, the whole
   site follows, including the dark/light scroll morph.
4. **Images** — swap the Unsplash URLs in `index.html` for the client's photos.
   Keep portrait crops for the arched frames.
5. **Discount popup** — copy in `index.html`, behaviour (scroll depth, delay,
   once-per-session) in `js/config.js`. Set `offer.enabled: false` to turn it off.

## What's inside

| File | Purpose |
|---|---|
| `index.html` | All content and inline SVG artwork |
| `css/style.css` | Design system ("The Vanity Case") — tokens, acts, components |
| `js/config.js` | Client config: WhatsApp, messages, popup behaviour |
| `js/main.js` | Motion engine: Lenis + GSAP ScrollTrigger, ribbon, popup, menu |
| `docs/DESIGN.md` | Design rationale |

Libraries load from CDNs (GSAP, Lenis). Everything degrades gracefully:
no JS → readable page; `prefers-reduced-motion` → static page.
