# Portfolio redesign — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing four-paragraph bio page with the marginalia-style single-page portfolio specified in `docs/superpowers/specs/2026-05-06-portfolio-redesign-design.md` — a centered text hero, a `Selected Work` section of six projects with sidenote commentary, an `Open Source` section with one entry, and a centered email footer, all inside a 1440px container.

**Architecture:** Astro 4 single-page app. Project data lives in `src/shared/constants.ts` as a typed array. Visual structure is composed from three new components — `Hero.astro`, `ProjectList.astro`, `Project.astro` — used by `src/pages/index.astro`. Existing `Layout.astro`, `Header.astro`, and `BaseHead.astro` are reused; `ThemeSwitch.astro` stays in source but its render call in `Header.astro` is commented out. Styles live in the existing `src/styles/global.css` (palette tokens + page-level rules) plus per-component `<style>` blocks.

**Tech Stack:** Astro 4, TypeScript, plain CSS (existing CSS-variable theme system), Bun (package manager / runtime).

---

## Important: commit policy

**Never run `git commit` for the user.** The user commits all code themselves. At the end of every task, run `git status` and `git diff` to surface the changes, suggest a commit message, and **stop**. Wait for the user to commit before starting the next task.

If working through this plan via `superpowers:subagent-driven-development` or `superpowers:executing-plans`, treat the "Pause for commit" step as a hard checkpoint — the orchestrator must hand control back to the user, not auto-commit.

---

## File structure (locked decomposition)

| Path | Action | Responsibility |
|---|---|---|
| `src/shared/constants.ts` | Modify | Existing `DEFAULT_TITLE` / `DEFAULT_DESC` kept. Add `Project` type + `WORK` array (6 entries) + `OPEN_SOURCE` array (1 entry). |
| `src/styles/global.css` | Modify | Replace the cool blue-grey palette with the warm cream + brown-ink palette. Bump `--maxContentWidth` from `85ch` to `1440px`. Keep dark-theme tokens defined (page is light-only while ThemeSwitch is hidden, but the tokens stay usable). Add new tokens for hairline / divider / muted / sidenote. Page-level rules for hero spacing, dividers, section labels, work container, footer. |
| `src/components/Hero.astro` | Create | Centered name `<h1>`, two-sentence bio, inline `email · github · linkedin` row. No photo, no phonetic. |
| `src/components/Project.astro` | Create | One row of the marginalia grid: project name (optional link), date or marker, summary with superscript ref, sidenote in the right column. Mobile: collapses to one column with the sidenote rendered inline below. |
| `src/components/ProjectList.astro` | Create | Section label + the centered 1080px container + maps over a `Project[]` and renders `<Project>` for each. |
| `src/components/Header.astro` | Modify | Comment out `<ThemeSwitch />` invocation (keep import). Add a `resume` link on the right side (opens in new tab). Existing `mzml_` wordmark + intersection-observer elevation script: untouched. |
| `src/pages/index.astro` | Modify (rewrite body) | Replace the four `<p>` paragraphs with: `<Hero />`, divider, `<ProjectList label="Selected Work" items={WORK} />`, divider, `<ProjectList label="Open Source" items={OPEN_SOURCE} />`, footer. |
| `src/layouts/Layout.astro` | Untouched | Continues to wrap pages with `<BaseHead>` + `<Header>` + `<main><slot /></main>`. |
| `src/components/ThemeSwitch.astro` | Untouched | Stays in repo for future re-enable. |
| `src/components/BaseHead.astro` | Untouched | Existing meta/head tags. |

---

## Verification model

There are no automated tests in this repo. The verification at every task step is:

1. The dev server is running (`bun run dev`).
2. Open http://localhost:4321 in a browser.
3. Visually confirm the change described in the step.
4. The TypeScript / Astro check passes (`bun run build` runs `astro check && astro build`).

Each task ends with a `bun run build` to make sure nothing regressed.

---

## Task 1: Add structured project data to `constants.ts`

**Files:**
- Modify: `src/shared/constants.ts`

- [ ] **Step 1.1: Add the `Project` type and the `WORK` and `OPEN_SOURCE` arrays**

Open `src/shared/constants.ts`. Replace the file contents with:

```typescript
export const DEFAULT_TITLE = "Muzzamil Raza" as const;
export const DEFAULT_DESC =
	"Hi! This is a portfolio/introductory website for Muzzamil Raza" as const;

export type Project = {
	name: string;
	/** Date range or marker (e.g. "Nov '25 — now", "contributing"). Rendered in mono uppercase. */
	date: string;
	/** One-line description rendered in the body column. */
	summary: string;
	/** Single-sentence commentary rendered in the right margin. */
	sidenote: string;
	/** Optional URL — when present, the project name renders as a link. */
	href?: string;
};

export const WORK: readonly Project[] = [
	{
		name: "AYTICS",
		date: "Nov '25 — now",
		summary:
			"Fintech platform digitizing bonding payments — sole full-stack engineer.",
		sidenote:
			"Building alone forces ruthless prioritization. Every feature has to earn its place against a backlog of one.",
	},
	{
		name: "TrueMark",
		date: "Oct '24 — Sep '25",
		summary:
			"DocuSign-style signing platform with biometric ID verification.",
		sidenote:
			"The hard part wasn't the Rekognition call — it was earning the trust the seven-second sign-and-verify promise required.",
	},
	{
		name: "FirstClass Healthcare",
		date: "Mar '23 — Oct '25",
		summary:
			"HIPAA-compliant medical and mental healthcare platform for correctional facilities.",
		sidenote:
			"The hardest UX problem wasn't compliance — it was designing for staff who hadn't asked for software in their job.",
	},
	{
		name: "Search Wavelength",
		date: "Oct '23 — Feb '24",
		summary:
			"Alumni-to-alma-mater connection platform — led full backend rewrite from Python to Node.",
		sidenote:
			"Built celery group-tasks on redis from scratch when the Node port didn't have them. Sometimes \"open source\" just means \"someone else hasn't written it yet.\"",
	},
	{
		name: "Drive Thru Urgent Care",
		date: "Mar '23 — Sep '23",
		summary:
			"Drive-through medical care booking platform with real-time patient–provider messaging.",
		sidenote:
			"Real-time chat is rarely about real-time. It's about not making the user wonder whether their message arrived.",
	},
	{
		name: "OneReel",
		date: "Jul '22 — Feb '23",
		summary:
			"Multi-user video calls livestreamed simultaneously across multiple social platforms.",
		sidenote:
			"Streaming to many platforms at once means failing on each one in slightly different ways. The work was making the failures legible.",
	},
] as const;

export const OPEN_SOURCE: readonly Project[] = [
	{
		name: "pallas-ui",
		date: "contributing",
		summary:
			"A React component library and design system, built in the open.",
		sidenote:
			"Designing primitives for other people's products forces you to be specific about what \"flexible\" actually means.",
		href: "https://github.com/PallasUI/pallas-ui",
	},
] as const;
```

- [ ] **Step 1.2: Confirm the project still type-checks**

Run:

```bash
bun run build
```

Expected: `astro check` passes (0 errors), `astro build` produces a `dist/` directory. The page contents will look unchanged because nothing imports the new data yet.

- [ ] **Step 1.3: Pause for commit**

Run:

```bash
git status
git diff src/shared/constants.ts
```

Suggested commit message:

```
add structured WORK and OPEN_SOURCE arrays + Project type
```

⚠️ **Do not run `git commit` yourself.** Wait for the user.

---

## Task 2: Update palette tokens and container width in `global.css`

**Files:**
- Modify: `src/styles/global.css`

This task swaps the cool blue-grey palette for the warm cream + brown-ink palette specified in the design, bumps the outer container from `85ch` to `1440px`, and adds new tokens for hairline / sidenote / muted text. Existing dark-theme tokens are preserved so re-enabling the theme switch later still works.

- [ ] **Step 2.1: Update the `:root` block — palette + container width + new tokens**

Open `src/styles/global.css`. Replace the entire `:root { ... }` block (lines 1–44 in the current file) with:

```css
:root {
  --blinkColor: black;
  --maxContentWidth: 1440px;

  /* Light theme — warm cream + brown ink */
  --backgroundColorLight: #fdfaf4;
  --textColorLight: #2c2417;
  --selectionColorLight: #e8dcb4;

  /* Dark theme — preserved (used when the theme switch is re-enabled) */
  --backgroundColorDark: #1d222a;
  --textColorDark: #b8b8b8;
  --selectionColorDark: #003666;

  /* Defaults: light */
  --backgroundColor: var(--backgroundColorLight);
  --selectionColor: var(--selectionColorLight);

  /* Marginalia / section accents — light theme */
  --textMutedLight: #6f5d3b;
  --textLabelLight: #8b7e5d;
  --hairlineLight: #ece2c9;
  --dividerLight: #d4c8a8;
  --underlineLight: #c9bf9f;

  /* Marginalia / section accents — dark theme (placeholders for when the switch is re-enabled) */
  --textMutedDark: #a09478;
  --textLabelDark: #8a8270;
  --hairlineDark: #2a2f38;
  --dividerDark: #3a4049;
  --underlineDark: #5a6473;

  /* Defaults: light */
  --textMuted: var(--textMutedLight);
  --textLabel: var(--textLabelLight);
  --hairline: var(--hairlineLight);
  --divider: var(--dividerLight);
  --underline: var(--underlineLight);

  --shadow: #161b3d1a;
  --shadow-color: 217deg 13% 61%;
  --shadow-color-dark: 217deg 29% 4%;
  --shadow-color-light: 217deg 13% 61%;

  --shadow-elevation-low:
    0px 0.5px 0.6px hsl(var(--shadow-color) / 0.34),
    0px 0.8px 0.9px -1.2px hsl(var(--shadow-color) / 0.34),
    0px 2px 2.3px -2.5px hsl(var(--shadow-color) / 0.34);
  --shadow-elevation-medium:
    0px 0.5px 0.6px hsl(var(--shadow-color) / 0.36),
    0px 1.6px 1.8px -0.8px hsl(var(--shadow-color) / 0.36),
    0.1px 4.1px 4.6px -1.7px hsl(var(--shadow-color) / 0.36),
    0.2px 9.9px 11.1px -2.5px hsl(var(--shadow-color) / 0.36);
  --shadow-elevation-high:
    0px 0.5px 0.6px hsl(var(--shadow-color) / 0.34),
    0.1px 2.9px 3.3px -0.4px hsl(var(--shadow-color) / 0.34),
    0.1px 5.4px 6.1px -0.7px hsl(var(--shadow-color) / 0.34),
    0.2px 8.9px 10px -1.1px hsl(var(--shadow-color) / 0.34),
    0.3px 14.2px 16px -1.4px hsl(var(--shadow-color) / 0.34),
    0.4px 22.1px 24.9px -1.8px hsl(var(--shadow-color) / 0.34),
    0.6px 33.6px 37.8px -2.1px hsl(var(--shadow-color) / 0.34),
    0.9px 49.5px 55.7px -2.5px hsl(var(--shadow-color) / 0.34);
}
```

- [ ] **Step 2.2: Update the `html.dark` block to set the new accent tokens to their dark-theme values**

Find the `html.dark` block (currently around lines 72–80). Replace it with:

```css
html.dark {
  background-color: var(--backgroundColorDark);
  --backgroundColor: var(--backgroundColorDark);
  color: var(--textColorDark);
  --blinkColor: var(--textColorDark);
  --selectionColor: var(--selectionColorDark);
  --shadow-color: var(--shadow-color-dark);
  --textMuted: var(--textMutedDark);
  --textLabel: var(--textLabelDark);
  --hairline: var(--hairlineDark);
  --divider: var(--dividerDark);
  --underline: var(--underlineDark);
}
```

Also update the `html.light` block (just below) to **explicitly set the light-theme accent tokens** so that toggling between themes is symmetric. Replace it with:

```css
html.light {
  background-color: var(--backgroundColorLight);
  --backgroundColor: var(--backgroundColorLight);
  color: var(--textColorLight);
  --blinkColor: var(--textColorLight);
  --selectionColor: var(--selectionColorLight);
  --shadow-color: var(--shadow-color-light);
  --textMuted: var(--textMutedLight);
  --textLabel: var(--textLabelLight);
  --hairline: var(--hairlineLight);
  --divider: var(--dividerLight);
  --underline: var(--underlineLight);
}
```

- [ ] **Step 2.3: Set the body default text color so the page renders with brown ink even before any theme class is applied**

Find the `body` rule (currently around lines 90–109). Add `color: var(--textColorLight);` right after the `font-family` line, so the rule starts:

```css
body {
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: var(--textColorLight);
  margin: 0;
  /* ... rest unchanged ... */
}
```

(With `ThemeSwitch.astro`'s render commented out later in Task 6, no `light` or `dark` class is applied to `<html>`. Setting `color` on `body` directly guarantees brown ink without relying on a class.)

- [ ] **Step 2.4: Restart dev and verify the palette swap**

Stop and restart the dev server:

```bash
bun run dev
```

Open http://localhost:4321. Expected:
- Background is warm cream (`#fdfaf4`).
- Body text is brown-black ink (`#2c2417`).
- Existing four bio paragraphs still render (we haven't replaced them yet).
- The header (with `mzml_` and the theme switch) still works.
- The page is wider than before — the four paragraphs are now confined to a 1440px container.

- [ ] **Step 2.5: Confirm `bun run build` still passes**

Run:

```bash
bun run build
```

Expected: 0 errors.

- [ ] **Step 2.6: Pause for commit**

```bash
git status
git diff src/styles/global.css
```

Suggested commit message:

```
swap to warm cream palette + bump container to 1440px
```

⚠️ **Do not run `git commit` yourself.** Wait for the user.

---

## Task 3: Build the `Hero` component and use it in `index.astro`

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 3.1: Create `Hero.astro`**

Create `src/components/Hero.astro` with:

```astro
---
// Centered text hero: name + two-sentence bio + inline contact links.
// No photo, no phonetic — see the design spec for rationale.
---

<section class="hero">
  <h1>Muzzamil Raza</h1>
  <p class="bio">
    Software engineer. I build products and untangle the hard parts. Drawn to
    the kind of work where the constraints are real and the answers aren't
    obvious.
  </p>
  <div class="links">
    <a href="mailto:hi@mzml.me">email</a>
    <a href="https://github.com/muzzamilr" target="_blank" rel="noopener">github</a>
    <a href="https://linkedin.com/in/muzzamilraza" target="_blank" rel="noopener">linkedin</a>
  </div>
</section>

<style>
  .hero {
    text-align: center;
    margin: 0 auto;
    max-width: 60ch;
  }
  .hero h1 {
    font-size: 2.6rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.015em;
    line-height: 1.1;
  }
  .hero .bio {
    font-size: 1.05rem;
    margin: 1.25rem auto 0 auto;
    max-width: 52ch;
    line-height: 1.65;
  }
  .hero .links {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
    font-size: 0.9rem;
  }
  .hero .links a {
    border-bottom: 1px solid var(--underline);
  }

  @media (max-width: 576px) {
    .hero h1 {
      font-size: 2.1rem;
    }
    .hero .bio {
      font-size: 1rem;
    }
  }
</style>
```

- [ ] **Step 3.2: Replace the four bio paragraphs in `index.astro` with `<Hero />`**

Open `src/pages/index.astro`. Replace the entire file contents with:

```astro
---
import "../styles/global.css";
import Layout from "../layouts/Layout.astro";
import Hero from "../components/Hero.astro";
---

<Layout>
  <Hero />
</Layout>
```

- [ ] **Step 3.3: Verify in the browser**

Reload http://localhost:4321. Expected:
- The four bio paragraphs are gone.
- A centered hero appears: large "Muzzamil Raza", the two-sentence bio, and a row of three inline links (email / github / linkedin).
- Header still has `mzml_` on the left and the theme switch on the right.

- [ ] **Step 3.4: Confirm build**

```bash
bun run build
```

Expected: 0 errors.

- [ ] **Step 3.5: Pause for commit**

```bash
git status
git diff
```

Suggested commit message:

```
replace bio paragraphs with Hero component
```

⚠️ **Do not run `git commit` yourself.** Wait for the user.

---

## Task 4: Build `Project` + `ProjectList` components and render `Selected Work`

**Files:**
- Create: `src/components/Project.astro`
- Create: `src/components/ProjectList.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 4.1: Create `Project.astro`**

Create `src/components/Project.astro` with:

```astro
---
import type { Project } from "../shared/constants";

interface Props {
  project: Project;
  index: number;
}

const { project, index } = Astro.props;

// Superscript glyph for cross-referencing the sidenote (¹, ², ...).
const SUPERSCRIPTS = ["¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
const ref = SUPERSCRIPTS[index] ?? `[${index + 1}]`;
---

<article class="project">
  <div class="body">
    <div class="row">
      <span class="name">
        {project.href
          ? <a href={project.href} target="_blank" rel="noopener">{project.name}</a>
          : project.name}
      </span>
      <span class="date">{project.date}</span>
    </div>
    <p class="summary">
      {project.summary}<sup class="ref">{ref}</sup>
    </p>
  </div>
  <aside class="marg" aria-label={`Note ${index + 1} on ${project.name}`}>
    <span class="marg-num">{index + 1}</span>{project.sidenote}
  </aside>
</article>

<style>
  .project {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 3rem;
    padding: 1.5rem 0;
    border-top: 1px solid var(--hairline);
  }
  .project:first-of-type {
    border-top: none;
  }
  .body {
    padding-right: 0.5rem;
    max-width: 56ch;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.4rem;
  }
  .name {
    font-weight: 700;
    font-size: 1.1rem;
  }
  .name a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px dotted var(--underline);
  }
  .date {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.72rem;
    color: var(--textLabel);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
  .summary {
    margin: 0;
    font-size: 0.96rem;
    line-height: 1.6;
  }
  .ref {
    color: var(--textMuted);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.62rem;
    margin-left: 0.15rem;
    text-decoration: none;
  }
  .marg {
    font-size: 0.84rem;
    line-height: 1.55;
    color: var(--textMuted);
    border-left: 2px solid var(--underline);
    padding-left: 1rem;
    font-style: italic;
    max-width: 30ch;
  }
  .marg-num {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.62rem;
    color: var(--textLabel);
    margin-right: 0.4rem;
    vertical-align: super;
    font-style: normal;
  }

  /* Mobile: collapse to single column. Sidenote renders inline below summary. */
  @media (max-width: 720px) {
    .project {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }
    .body {
      padding-right: 0;
      max-width: 100%;
    }
    .marg {
      max-width: 100%;
    }
  }
</style>
```

- [ ] **Step 4.2: Create `ProjectList.astro`**

Create `src/components/ProjectList.astro` with:

```astro
---
import type { Project } from "../shared/constants";
import ProjectItem from "./Project.astro";

interface Props {
  label: string;
  items: readonly Project[];
}

const { label, items } = Astro.props;
---

<section class="project-list">
  <div class="label">{label}</div>
  <div class="items">
    {items.map((project, i) => <ProjectItem project={project} index={i} />)}
  </div>
</section>

<style>
  .project-list {
    width: 100%;
  }
  .label {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--textLabel);
    text-align: center;
    margin-bottom: 2rem;
  }
  .items {
    max-width: 1080px;
    margin: 0 auto;
  }
</style>
```

- [ ] **Step 4.3: Wire up `Selected Work` in `index.astro`**

Open `src/pages/index.astro` and replace it with:

```astro
---
import "../styles/global.css";
import Layout from "../layouts/Layout.astro";
import Hero from "../components/Hero.astro";
import ProjectList from "../components/ProjectList.astro";
import { WORK } from "../shared/constants";
---

<Layout>
  <Hero />

  <hr class="divider" />

  <ProjectList label="Selected Work" items={WORK} />
</Layout>

<style>
  .divider {
    border: none;
    border-top: 1px solid var(--divider);
    width: 60px;
    margin: 3rem auto;
  }
</style>
```

- [ ] **Step 4.4: Verify in the browser**

Reload http://localhost:4321. Expected:
- Below the hero and the centered short divider, a "Selected Work" mono uppercase label appears.
- All six projects render as rows with the project name + date on the left, summary below, and a sidenote (italic, left-bordered) on the right.
- A hairline separates each project except the first.
- Project names are not links (no `href` in `WORK`). Dates render in mono uppercase, muted color.

- [ ] **Step 4.5: Confirm build**

```bash
bun run build
```

Expected: 0 errors.

- [ ] **Step 4.6: Pause for commit**

```bash
git status
git diff
```

Suggested commit message:

```
add Project + ProjectList components, render Selected Work
```

⚠️ **Do not run `git commit` yourself.** Wait for the user.

---

## Task 5: Render the `Open Source` section and the email footer

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 5.1: Add the second `ProjectList` and a centered footer to `index.astro`**

Open `src/pages/index.astro` and replace it with:

```astro
---
import "../styles/global.css";
import Layout from "../layouts/Layout.astro";
import Hero from "../components/Hero.astro";
import ProjectList from "../components/ProjectList.astro";
import { WORK, OPEN_SOURCE } from "../shared/constants";
---

<Layout>
  <Hero />

  <hr class="divider" />

  <ProjectList label="Selected Work" items={WORK} />

  <hr class="divider" />

  <ProjectList label="Open Source" items={OPEN_SOURCE} />

  <footer class="page-footer">
    — <a href="mailto:hi@mzml.me">hi@mzml.me</a> —
  </footer>
</Layout>

<style>
  .divider {
    border: none;
    border-top: 1px solid var(--divider);
    width: 60px;
    margin: 3rem auto;
  }
  .page-footer {
    text-align: center;
    margin-top: 3.5rem;
    font-size: 0.85rem;
    color: var(--textMuted);
  }
  .page-footer a {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid var(--underline);
  }
</style>
```

- [ ] **Step 5.2: Verify in the browser**

Reload http://localhost:4321. Expected:
- After the Selected Work section, a second short divider appears.
- An "Open Source" label, then one project row: `pallas-ui` (linked to GitHub, dotted underline) on the left, "contributing" on the right, summary below, and a sidenote on the right.
- A centered footer "— hi@mzml.me —" with the email as a `mailto:` link.

- [ ] **Step 5.3: Confirm build**

```bash
bun run build
```

Expected: 0 errors.

- [ ] **Step 5.4: Pause for commit**

```bash
git status
git diff
```

Suggested commit message:

```
add Open Source section and email footer
```

⚠️ **Do not run `git commit` yourself.** Wait for the user.

---

## Task 6: Update `Header.astro` — add `resume` link, comment out `<ThemeSwitch />`

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 6.1: Update `Header.astro`**

Open `src/components/Header.astro` and replace its contents with:

```astro
---
import ThemeSwitch from "./ThemeSwitch.astro";
---

<header>
  <h1>
    <a href="/">mzml<span class="blinking-cursor">_</span></a>
  </h1>
  <nav class="nav">
    <a href="/Muzzamil-Resume.pdf" target="_blank" rel="noopener">resume</a>
    <!--
      Theme switch is intentionally hidden for now.
      Re-enable by uncommenting the line below.
      The component file (ThemeSwitch.astro) is kept in source.
    -->
    <!-- <ThemeSwitch /> -->
  </nav>
</header>
<div id="intersecter"></div>
<script>
  let setup = () => {
    let i = document.getElementById("intersecter")!;
    let t = document.querySelector("header")!;
    new IntersectionObserver(([i]) =>
      t.classList.toggle("elevated", !i.isIntersecting),
    ).observe(i);
  };

  ["interactive", "complete"].includes(document.readyState)
    ? setup()
    : document.addEventListener("DOMContentLoaded", setup);
</script>
<style>
  a {
    font-size: 2rem;
    font-weight: 600;
  }
  .nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .nav a {
    font-size: 0.95rem;
    font-weight: 500;
    border-bottom: 1px solid var(--underline);
  }
</style>
```

Notes:
- The `import ThemeSwitch from "./ThemeSwitch.astro"` import stays so re-enabling is a single uncomment.
- Astro will warn about an unused import. To keep `astro check` clean, the import is preserved but the component is referenced by an HTML comment — Astro **does** treat the import as used because of the commented JSX reference is actually plain HTML. If `astro check` flags the import as unused, replace the JSX comment `<!-- <ThemeSwitch /> -->` with a TS-side reference inside the frontmatter:
  ```ts
  // Keep the import alive for tooling; render is intentionally disabled.
  void ThemeSwitch;
  ```
- The `resume` link points at the existing `/Muzzamil-Resume.pdf` file in `public/`.

- [ ] **Step 6.2: Verify in the browser**

Reload http://localhost:4321. Expected:
- Header still has the `mzml_` wordmark with blinking cursor on the left.
- Right side now shows a small "resume" link (underlined). The theme switch toggle is gone.
- Clicking "resume" opens `Muzzamil-Resume.pdf` in a new tab.
- Scrolling the page still triggers the elevated-header shadow effect (intersection observer).

- [ ] **Step 6.3: Confirm build**

```bash
bun run build
```

Expected: 0 errors. If `astro check` complains about the unused `ThemeSwitch` import, apply the `void ThemeSwitch;` workaround documented in 6.1 and rebuild.

- [ ] **Step 6.4: Pause for commit**

```bash
git status
git diff src/components/Header.astro
```

Suggested commit message:

```
add resume link, hide theme switch (kept in source)
```

⚠️ **Do not run `git commit` yourself.** Wait for the user.

---

## Task 7: Mobile sweep

The `Project.astro` styles already include a `@media (max-width: 720px)` block that collapses the two-column grid. This task verifies that the rest of the page also behaves correctly on a narrow viewport, and tightens any sizing issues that surface.

**Files:**
- Possibly modify: `src/components/Hero.astro`, `src/components/ProjectList.astro`, `src/styles/global.css`, `src/pages/index.astro`

- [ ] **Step 7.1: Verify mobile layout in the browser**

In a desktop browser, open dev tools and switch to a 375×812 (iPhone-class) viewport. Reload http://localhost:4321. Walk through:

- The header still fits, with `mzml_` on the left and `resume` on the right (no overflow).
- The hero title `Muzzamil Raza` does not overflow; the bio wraps comfortably; the three inline links wrap to multiple lines if needed without overflowing.
- Each project row collapses to one column. Project name + date are on the same line at the top; summary directly below; **sidenote follows immediately below the summary**, italicized, with the same left border.
- Section labels remain centered.
- The footer stays centered.

- [ ] **Step 7.2: Fix anything that overflows**

If any element overflows or feels cramped, adjust the relevant component's `<style>` block. Common likely tweaks:

- Tighten `padding` on the outer `main` rule in `global.css` (it currently uses a `max(...)` formula that produces `1rem` on narrow viewports — confirm this still applies with `--maxContentWidth: 1440px`).
- Wrap long mono date strings: `.date { white-space: normal; }` inside the `<720px` block.
- Reduce the hero `gap` between inline links if they crowd.

If no fixes are needed, this step is a no-op — note that explicitly in the commit message.

- [ ] **Step 7.3: Re-verify desktop layout**

Switch back to a desktop viewport (≥ 1280px). Confirm everything still looks like it did before the mobile sweep. The 1440px container caps centered content correctly on a wide monitor.

- [ ] **Step 7.4: Confirm build**

```bash
bun run build
```

Expected: 0 errors.

- [ ] **Step 7.5: Pause for commit**

```bash
git status
git diff
```

Suggested commit message (adjust based on what changed):

```
mobile: verify and tighten responsive layout
```

If nothing changed in 7.2, skip this commit and move on.

⚠️ **Do not run `git commit` yourself.** Wait for the user.

---

## Task 8: Final pass — build, visual sweep, sign-off

**Files:**
- None modified in this task. Verification only.

- [ ] **Step 8.1: Full type-check + production build**

```bash
bun run build
```

Expected:
- `astro check` reports 0 errors and 0 warnings.
- `astro build` writes a `dist/` directory.

- [ ] **Step 8.2: Preview the production build**

```bash
bun run preview
```

Expected: a local server (typically http://localhost:4321) serves the built site. Walk through the page once more:

- Header: `mzml_` left, `resume` right, no theme toggle.
- Hero: centered "Muzzamil Raza", two-sentence bio, three inline links.
- Divider.
- Selected Work: 6 projects with sidenotes.
- Divider.
- Open Source: 1 project (pallas-ui) with sidenote and a working GitHub link.
- Footer: centered `hi@mzml.me`.
- The header elevation-on-scroll effect still works.
- The blinking cursor on `mzml_` still animates.

- [ ] **Step 8.3: Verify the spec acceptance criteria**

Re-read `docs/superpowers/specs/2026-05-06-portfolio-redesign-design.md` § Acceptance and confirm each bullet:

- [x] Page reads top to bottom in the specified order.
- [x] Two-column project rows on ≥1024px viewports.
- [x] Single-column project rows on <720px with inline italic sidenote.
- [x] `astro check` and `astro build` pass cleanly.
- [x] Theme switch button not visible; `ThemeSwitch.astro` still in source; import + commented render still in `Header.astro`.
- [x] 1440px outer cap respected.

- [ ] **Step 8.4: Pause for final commit**

If any small fixes were made in this final pass:

```bash
git status
git diff
```

Suggested commit message:

```
final polish for portfolio redesign
```

If nothing changed, the redesign is complete — no commit needed.

⚠️ **Do not run `git commit` yourself.** Wait for the user.

---

## Acceptance — done when

- All eight tasks are checked off.
- The user has reviewed the live site at http://localhost:4321 (dev) and the production build via `bun run preview`.
- The user is satisfied with the placeholder marginalia text or has rewritten it in `src/shared/constants.ts`.
