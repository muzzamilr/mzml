# Portfolio redesign — design spec

**Date:** 2026-05-06
**Site:** mzml.me
**Stack:** Astro 4 (existing project)

## Motivation

The current `mzml.me` is a four-paragraph bio with a resume link and two social links. It does not communicate that the owner is a working software engineer or what he has built. The redesign turns the page into a single-page developer portfolio — minimal in tone, but substantive: bio + selected work + open source + contact, all on one scroll.

The visual model is **Tufte-style marginalia**: each project entry has a main column with the facts and a side margin with the author's commentary. This format suits the bio voice ("untangle the hard parts") because it leaves room for judgment without inflating the project descriptions themselves.

References absorbed during design: [farshed.me](https://farshed.me), [delba.dev](https://delba.dev), [leerob.com](https://leerob.com).

## Design

### Page structure (top to bottom)

1. **Top bar** — `mzml_` wordmark (existing, with blinking cursor) on the left; single `resume` link on the right (opens in a new tab via `target="_blank"`, matching the existing site's convention). Theme switch component is rendered in code but its usage is commented out for now.
2. **Hero** — centered. Name as `<h1>`. Two-sentence bio. A row of inline links (`email · github · linkedin`).
3. **Divider** — short centered hairline.
4. **Selected Work** — small uppercase mono label, then six project entries in a two-column grid (facts left, sidenote right).
5. **Divider**.
6. **Open Source** — same layout as Selected Work; one entry today (`pallas-ui`).
7. **Footer** — centered `hi@mzml.me`.

### Layout system

- Outer page container: `max-width: 1440px`, centered, with horizontal padding.
- Hero: centered, text capped at `~60ch` for readability.
- Project list rows: `max-width: 1080px`, centered. Each row is a CSS grid with two columns (`minmax(0, 1.6fr) minmax(0, 1fr)`) and a `~3rem` gap. Body column max `~56ch`. Marg column max `~30ch`.
- **Mobile (< ~720px):** the two-column grid collapses to a single column. Sidenotes render *inline* below each project's summary, in italic, with the same left-border treatment, but full width.

### Hero copy (locked)

> **Muzzamil Raza**
>
> Software engineer. I build products and untangle the hard parts. Drawn to the kind of work where the constraints are real and the answers aren't obvious.

No phonetic. No photo.

### Selected Work — entries

All six projects below render as: project name + date range + one-sentence summary + a single sentence of marginalia. The marginalia drafts below are *placeholders the author will edit*; the page must accommodate them gracefully if rewritten to longer/shorter lengths.

| # | Name | Dates | Summary | Sidenote (placeholder) |
|---|---|---|---|---|
| 1 | AYTICS | Nov '25 — now | Fintech platform digitizing bonding payments — sole full-stack engineer. | Building alone forces ruthless prioritization. Every feature has to earn its place against a backlog of one. |
| 2 | TrueMark | Oct '24 — Sep '25 | DocuSign-style signing platform with biometric ID verification. | The hard part wasn't the Rekognition call — it was earning the trust the seven-second sign-and-verify promise required. |
| 3 | FirstClass Healthcare | Mar '23 — Oct '25 | HIPAA-compliant medical and mental healthcare platform for correctional facilities. | The hardest UX problem wasn't compliance — it was designing for staff who hadn't asked for software in their job. |
| 4 | Search Wavelength | Oct '23 — Feb '24 | Alumni-to-alma-mater connection platform — led full backend rewrite from Python to Node. | Built celery group-tasks on redis from scratch when the Node port didn't have them. Sometimes "open source" just means "someone else hasn't written it yet." |
| 5 | Drive Thru Urgent Care | Mar '23 — Sep '23 | Drive-through medical care booking platform with real-time patient–provider messaging. | Real-time chat is rarely about real-time. It's about not making the user wonder whether their message arrived. |
| 6 | OneReel | Jul '22 — Feb '23 | Multi-user video calls livestreamed simultaneously across multiple social platforms. | Streaming to many platforms at once means failing on each one in slightly different ways. The work was making the failures legible. |

Project names are not links (no per-project pages exist). Date ranges render in monospace, uppercase, muted color.

### Open Source — entries

| # | Name | Marker | Summary | Sidenote (placeholder) |
|---|---|---|---|---|
| 7 | [pallas-ui](https://github.com/PallasUI/pallas-ui) | contributing | A React component library and design system, built in the open. | Designing primitives for other people's products forces you to be specific about what "flexible" actually means. |

The repo name is a link to GitHub. The "contributing" marker takes the slot a date range would in Selected Work.

### Visual language

- **Body type:** existing Inter (sans). Existing fonts already loaded; no new font files needed in this spec. Visual references during design used a serif (Iowan Old Style) for the marginalia treatment, but to keep the implementation aligned with the existing repo and avoid pulling in a new font, **the implementation uses Inter for body**. Marginalia is differentiated by italic, smaller size, muted color, and the left-border rule rather than by font family.
- **Mono:** system monospace stack (`ui-monospace, SFMono-Regular, Menlo, monospace`) for dates, section labels, and the `mzml_` wordmark blink area.
- **Color:** the page moves from the existing cool blue-grey palette to a **warm cream + brown-ink palette** (this is what the user signed off on visually during brainstorming). New light-theme values:
  - `--backgroundColorLight: #fdfaf4` (warm cream)
  - `--textColorLight: #2c2417` (brown-black ink)
  - text muted / sidenote: `#6f5d3b`
  - section label / mono labels: `#8b7e5d`
  - hairline / project-row border: `#ece2c9`
  - divider: `#d4c8a8`
  - link underline: `#c9bf9f`

  The existing dark-theme tokens (`--backgroundColorDark`, `--textColorDark`, etc.) are kept and given matching warm-equivalent values where it makes sense (or left untouched — implementation choice — since dark mode is not reachable while the theme switch is hidden). Both themes' tokens stay defined so that uncommenting the theme switch later just works.
- **Spacing:** generous. Hero `margin-bottom: 4rem`. Section dividers `~3rem` margin. Each project row `padding: 1.5rem 0` with a top hairline.
- **Section labels:** mono, uppercase, letter-spacing `~0.18em`, muted color, centered above each section.
- **Sidenote:** italic, `font-size: 0.84rem`, muted color, `border-left: 2px solid <hairline>`, `padding-left: 1rem`. A small superscript number in the project body (`¹`, `²` …) cross-references the sidenote so a screen-reader user reading sequentially gets the link.

### Theme switch

`src/components/ThemeSwitch.astro` is **not deleted**. The render call inside `Header.astro` (currently `<ThemeSwitch />`) is commented out, with a short HTML comment noting that this is intentional and temporary. Re-enabling the switcher is a one-line uncomment.

Because `ThemeSwitch.astro` also carries the inline `<script>` that reads `localStorage`/`prefers-color-scheme` and applies the `dark` class to `<html>`, commenting out the render also removes that script from the page. The consequence: the page renders with `:root` styles only — i.e., **light theme always**, regardless of OS preference. This is acceptable: the user's request is "hide the switcher for now," and a single, predictable light theme is consistent with that request. When the switcher is re-enabled, the script comes back and OS-preference + persistence resume working.

### Behavior preserved from current site

- Header elevation on scroll (intersection-observer) — kept.
- Blinking cursor in the `mzml_` wordmark — kept.
- Light/dark theme tokens — kept; the absent toggle simply means whichever theme is the default applies. (Default theme is whatever `Layout.astro` already initializes.)

## What this spec does not include

- A `/writings` page. Top-nav `writings` link is dropped for now. Spec for that page is a separate effort.
- Per-project detail pages.
- Any new font assets.
- Adding a photo. Hero is text-only.
- Animations beyond the existing header elevation.
- An RSS or sitemap addition (the existing site is one page; nothing new to index).

## Files affected (high level)

- `src/pages/index.astro` — rewritten to express the new page structure.
- `src/components/Header.astro` — kept, with the `<ThemeSwitch />` invocation commented out and a single `resume` link added on the right.
- `src/styles/global.css` — extended with new tokens (section label, sidenote, hairline) and rules for hero, section labels, project rows, marginalia, footer. Existing tokens preserved.
- `src/shared/constants.ts` — extended with a structured `WORK` and `OPEN_SOURCE` data array (so the project list is data-driven, not hand-typed in the template).
- `src/components/` — new components: `Hero.astro`, `ProjectList.astro`, `Project.astro` (or equivalent — exact decomposition is an implementation choice, but the page should not be one giant `index.astro`).
- `src/components/ThemeSwitch.astro` — untouched.

## Acceptance

- The page reads top to bottom in this order: top bar, hero, divider, Selected Work (six entries), divider, Open Source (one entry), footer.
- On a desktop viewport (≥ 1024px wide), each project row shows the body and the sidenote side-by-side in two columns.
- On a mobile viewport (< 720px), the project rows collapse to a single column with the sidenote rendered inline beneath the summary, italicized, with its left border preserved.
- The page passes `astro check` and `astro build` without warnings.
- The theme switch button is not visible. Its component file remains in `src/components/ThemeSwitch.astro` and the import + render call still exist in source, just commented out.
- The 1440px outer cap is respected: on a 4K monitor, content stops at 1440px and is centered, with no full-bleed elements bleeding past it.
