# VELOURA — The Beauty Atelier · Design Spec

One-page luxury template for salon owners & makeup artists. Frontend-only, no build step.
Deploy: drag the folder into Netlify / GitHub Pages / any static host.

## Concept — "The Vanity Case"
The page moves between two worlds as you scroll, like opening a lacquered vanity case:
**Noir Velvet** (deep plum-black, the outside) and **Powder Porcelain** (warm ivory, the inside).
Background and text colors cross-fade between acts via a class toggle on `<body>`.

**Signature element:** a continuous champagne-gold SVG "kajal stroke" — a single calligraphic
ribbon path behind the content that draws itself (stroke-dashoffset) across the entire page as
you scroll. Everything else stays quiet and typographic.

## Palette
| Token | Hex | Use |
|---|---|---|
| Noir Velvet | `#1A0E13` | dark act backgrounds |
| Ink | `#241318` | text on porcelain |
| Porcelain | `#F7EFE8` | light act backgrounds, text on noir |
| Rouge | `#B02940` | primary accent, CTAs |
| Rose Poudre | `#DCA1A6` | soft tints, hairlines on noir |
| Champagne | `#CBA35C` | ribbon, foil details, eyebrows |

## Type
- **Display:** Fraunces (variable, opsz/SOFT/WONK) — headlines; *italic* for the emphasis word.
- **Body/UI:** Jost — geometric, 1920s-vanity feel. Eyebrows: Jost 500, letterspaced small caps.
- Scale: clamp()-based; hero ~ clamp(3rem, 10vw, 7.5rem).

## Motion
Lenis smooth scroll + GSAP ScrollTrigger (CDN). Ribbon scrub, act color morph,
masked line reveals, arch-image parallax, pinned horizontal gallery (desktop) /
scroll-snap (mobile), CSS marquee. `prefers-reduced-motion`: everything static.

## Page order
Preloader (V monogram draw) → Nav → Hero (noir) → Marquee → About (porcelain) →
Services & price menu (porcelain) → Bridal packages (noir) → Gallery (noir→porcelain) →
Testimonials → Founder → FAQ → Final CTA (noir) + Footer.
Overlays: discount popup (38% scroll or 30s, once/session), floating WhatsApp pill,
mobile sticky book bar.

## Conversion
Every CTA opens `https://wa.me/918308936941?text=<prefilled>`; each service row and
bridal package sends its own message. Popup: 20% off first visit, gift-card styling.

## Recurring motif
Arched "vanity mirror" image masks (border-radius top ~50%), thin double-line arch ornament.
