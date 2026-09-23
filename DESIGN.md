# Design System — bilalshihab.com ("Bench Notebook")

## Product context
- **What this is:** Bilal Shihab's portfolio. A home index plus one page per project, linked directly from his resume.
- **Who it's for:** Recruiters (skim for ~7 seconds) and PIs (read the specs and method).
- **The one thing to remember:** *He builds real hardware + ML.* Every choice serves that.
- **Project type:** Static HTML/CSS on GitHub Pages. No build step, no framework, no JS needed.

## Aesthetic direction
- **Direction:** Bench notebook. A quiet editorial page with datasheet precision. Hard numbers up front, real artifacts as images.
- **Decoration:** Minimal. Hairline rules and type do the work. The one ornament is the ECG trace under the name.
- **References:** bernied04.github.io (closest peer; we share its fonts on purpose but differ in accent, specs, and structure), jonbarron.info (thumbnail + metadata rows), jaycarlson.net (spec tables).
- **Never:** purple/indigo, gradients, glows, glassmorphism, identical rounded cards, tech-stack pills, emoji icons, scroll fade-ins, an AI chat box, italic display serifs, cream + terracotta.

## Typography (Google Fonts)
- **Display / headings:** Fraunces, weight 560, upright only, `opsz` matched to size. Name, project titles, section heads.
- **Body:** Radio Canada (CBC/Radio-Canada's typeface, by Coppers and Brasses, Charles Daoud, Eli Heuer). 17px / 1.6.
- **Data / labels:** IBM Plex Mono 400/500, 11.5–13px. Years, spec keys, captions, figure numbers, group heads (uppercase, +0.08em).
- **Scale:** 52 (project h1) · 44 (name) · 24 · 22 (row title) · 21 (result line) · 19 (intro) · 17 (body) · 15.5 · 14 · 13 · 12 · 11.5.
- Phone (≤560px): 40 / 36 / 19.

## Color
- **Approach:** Restrained. One accent, used for links (underline), hover, the ECG trace, and at most one highlight in a chart.

| Token | Light | Dark |
|---|---|---|
| `--paper` background | `#F5F3EE` | `#141312` |
| `--surface` image wells | `#EDEAE3` | `#1D1C1A` |
| `--ink` text, strong rules | `#1A1917` | `#ECE8DF` |
| `--muted` secondary text | `#5E5A52` | `#A9A398` |
| `--faint` tertiary | `#8C877D` | `#7A756C` |
| `--rule` hairlines | `#DEDAD0` | `#2F2D29` |
| `--accent` ECG red | `#B8322A` | `#E8685C` |

Dark mode follows the OS (`prefers-color-scheme`); there is no toggle.

## Layout
- One column, max 720px, 20px side gutter.
- **Home:** name + nav → ECG trace (real MIT-BIH record 100, lead MLII, 4 s at 360 Hz) → intro → project index grouped by domain. Each row: 4:3 thumbnail (136px; 96px on phones), title, year, one line with a real number.
- **Project page** (`/<slug>/`): crumb → title → one-sentence result → mono meta line (role · dates · status) → **spec block** (two-column key/value datasheet between two ink rules) → hero image (16:10) → the write-up (Bilal's own words) → figures → links → next project.
- **Favicon:** `favicon.svg`, Fraunces "B" (opsz 9, weight 700, outlined to a path) in `#B8322A` on `#F5F3EE`.
- **Radius:** 0 everywhere. **Shadows:** none.

## Images
- Real artifacts only: board photos, device screenshots, real plots. No stock, no AI images, no 3D blobs.
- Thumbnails 4:3, hero 16:10. Shoot hardware top-down on white paper, no flash, lens parallel to the board.
- Until an image exists, the slot stays an empty `--surface` box with a hairline border.

## Motion
- None. Only link color changes on hover.

## Adding a project
1. Copy an existing `/<slug>/index.html` folder, keep slugs short, lowercase and hyphenated, and never rename one once it's on a resume.
2. Fill in title, result line, meta, and spec rows (facts only).
3. Add a row to the right group in `index.html`, and point the previous project's "Next project" link at it.

## Decisions log
| Date | Decision | Rationale |
|---|---|---|
| 2026-09-22 | System created (/design-consultation) | Old site read as AI-generated (dark, purple, Inter, glows, AI chat). Research: designer critiques, peer portfolios. |
| 2026-09-22 | Fraunces + Radio Canada + IBM Plex Mono (option B) | Bilal liked Bernard Dohrn's Fraunces/Plex look and wanted a CBC feel; Radio Canada is CBC's own font and separates the site from Bernard's. |
| 2026-09-22 | ECG red accent `#B8322A` | Biomedical, unused by peers; Bernard uses green. |
| 2026-09-22 | Spec block on every project page | Signals "builds real hardware + ML" at a glance. |
| 2026-09-22 | Favicon: Fraunces "B", not a pulse | A pulse icon is generic health-tech; the B identifies Bilal in a tab and the ECG trace already carries the motif. |
| 2026-09-22 | Wang Lab never appears on the site | Unpublished research, private. |
