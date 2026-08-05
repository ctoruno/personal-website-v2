# carlos-toruno.com

Personal website of Carlos A. Toruño P. — CV, publications, projects, and *A Gallo Pinto Blog*. Built with [Astro 7](https://astro.build), Tailwind CSS v4, and MDX.

## Commands

| Command           | Action                                             |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Install dependencies                               |
| `npm run dev`     | Start the dev server at `localhost:4321`           |
| `npm run build`   | Build the production site to `./dist/`             |
| `npm run preview` | Preview the production build locally               |

## Where things live

```text
src/
├── assets/                  Images processed by Astro (portrait, publication covers)
│   └── publication_covers/  3:4 covers referenced from publications.json
├── components/              Nav, Footer, cards, rows, MDX components (Figure, YouTube)…
├── content/
│   ├── blog/                One folder per post: <slug>/index.mdx
│   └── projects/            One file per project: <slug>.mdx
├── data/
│   ├── site.ts              Site-wide facts: name, tagline, email, social links
│   ├── cv.json              Everything on the CV page
│   ├── publications.json    Everything on the Publications page
│   ├── publications.ts      Schema + validation for publications.json
│   └── series.json          Title, blurb, and status of each blog series
├── layouts/                 BaseLayout (shell) and EntryLayout (post/project shell)
├── pages/                   Routes — home, cv, blog, projects, publications, rss, 404
└── styles/global.css        Design tokens and all prose/code styling

public/                      Served as-is at the site root: PDFs, favicon
```

Schemas are enforced: blog and project frontmatter is validated by
[`src/content.config.ts`](src/content.config.ts), publications by
[`src/data/publications.ts`](src/data/publications.ts). A typo in a field name
or a missing required field fails the dev server / build with a message
pointing at the file — that is intentional.

## Adding a blog post

Create a folder under `src/content/blog/` with an `index.mdx` inside. The
folder name is the URL: `src/content/blog/my-new-post/index.mdx` →
`/blog/my-new-post/`.

```mdx
---
title: My new post
standfirst: The line shown under the title on the post page.   # optional
summary: The excerpt shown in the blog index and used as the meta description.
date: 2026-08-05
topic: Data Viz          # exactly one topic; shows in the meta line
draft: false             # optional; true hides the post everywhere
---

Body in Markdown/MDX. Code fences get syntax highlighting (r, python, bash, yaml).
```

Two components are available in every post without importing them:

```mdx
<Figure src={hero} alt="What the image shows" caption="Optional caption." wide />
<YouTube id="dQw4w9WgXcQ" title="Talk title" />
```

For `<Figure>`, put the image next to the post and import it at the top of the
MDX body (`import hero from './hero.png';`). `wide` lets it bleed past the text
column on desktop.

Reading time is computed automatically; the author card, prev/next links, and
RSS entry all come for free.

## Adding a post to a series

A series is just blog posts that declare membership in their frontmatter —
folder names play no role. Two steps:

1. **Frontmatter** — add `series` (the series id) and `part` (its number) to a
   normal blog post:

   ```yaml
   series: classification-system
   part: 7
   ```

   By convention the post lives in a subfolder of the series
   (`src/content/blog/classification-system/07-whatever/index.mdx`), which makes
   the URL `/blog/classification-system/07-whatever/` — but it is the
   frontmatter, not the path, that the site reads.

2. **`src/data/series.json`** — make sure the series id has an entry:

   ```json
   "classification-system": {
     "title": "Building a classification system",
     "blurb": "One or two sentences shown on the series card in the blog index.",
     "status": "ongoing"
   }
   ```

   `status` is `"ongoing"` or `"complete"` — ongoing shows in the series card's
   meta line.

What you get automatically: the blog index collapses the series into a single
card listing its parts; the post page shows a series strip under the title;
prev/next navigation stays inside the series (only the first and last part link
out to the wider chronology).

When starting a **new** series, pick a new id, use it in the posts'
frontmatter, and add its entry to `series.json` — that's all.

## Adding a project

Create one file in `src/content/projects/`, e.g. `my-dashboard.mdx` →
`/projects/my-dashboard/`.

```mdx
---
title: My dashboard
kicker: Dashboard            # must be one of: Dashboard, Publication, Open source
standfirst: One sentence shown under the title on the project page.
summary: Shorter line used on the project card in the index.
role: Sole developer
years: 2024 — 2026           # free text; quote it if it's a bare number ("2024")
stack: [R, Shiny, DuckDB]
client: World Justice Project
liveUrl: https://example.com     # optional; "View live" button
repoUrl: https://github.com/...  # optional; "Source" button
order: 3                     # position in the index (lower = higher)
featured: false
---

## The problem
...

## What I built
...
```

The facts strip (role / years / stack / client) renders from the frontmatter.
Optional images: `hero` + `heroAlt` for the top of the page, and a `gallery`
list (`src` / `alt` / `caption` per item) — image paths resolve relative to the
file, so keep project images in a folder they can reference.

## Editing the CV

Everything on `/cv/` comes from [`src/data/cv.json`](src/data/cv.json) — the
page template never needs touching:

- **`intro`** — array of paragraphs at the top.
- **`pdf`** — path to the downloadable CV; the file itself is `public/cv.pdf`
  (replace the file to update the download, no JSON change needed).
- **`experience`** — one object per role: `start`, `end` (shown stacked in the
  timeline column, e.g. `"Apr 2022"` / `"Dec 2025"` or `"present"`), `role`,
  `org`, `description`. Order in the array is display order.
- **`education`** — `degree` + `org` (org line carries university and years).
- **`skills`** — one row per ability: `{ "ability": "...", "stack": ["...", ...] }`.
  The stack renders joined with `·` in the mono font; an **empty** `stack`
  renders an em dash, for method skills that have no tooling to list.

## Editing the Publications page

Everything on `/publications/` comes from
[`src/data/publications.json`](src/data/publications.json), validated by
`publications.ts`. One object per publication:

```json
{
  "slug": "unique-id",
  "title": "Title shown on the row",
  "authors": "Toruño, C. & Pardo, S.",
  "venue": "FUNIDES, Managua · in Spanish",
  "year": 2025,
  "type": "report",
  "cover": "../assets/publication_covers/my_cover_3x4.png",
  "description": "One or two sentences shown under the citation line.",
  "links": [
    { "label": "PDF", "href": "/my_file.pdf", "primary": true },
    { "label": "Site", "href": "https://...", "external": true }
  ]
}
```

Rules the schema enforces:

- **`type`** must be `report`, `note`, `thesis`, or `chapter`. The filter chips
  at the top of the page are generated from the types that actually occur — use
  a new type in the enum and its chip appears automatically.
- **`links`** — at least one, and **exactly one** must have `"primary": true`
  (it gets the accent underline). `"external": true` adds the ↗ marker for
  offsite links.
- **`cover`** is optional. Drop a 3:4 image in `src/assets/publication_covers/`
  and reference it as `"../assets/publication_covers/<filename>"` — the path
  must match exactly or the build fails with "cover not found". Entries without
  a cover get the accent-ruled "No cover" slot.
- Sorting is by `year` descending, then array order within a year — so to
  reorder publications from the same year, reorder them in the file.

## PDFs and other static files

Anything in `public/` is served as-is from the site root:
`public/democracia_local.pdf` → `https://www.carlos-toruno.com/democracia_local.pdf`.
Link to these with root-relative hrefs (`/democracia_local.pdf`) from
publications, posts, or anywhere else.

## Site-wide facts

Name, tagline, home-page bio, email, and social links live in
[`src/data/site.ts`](src/data/site.ts). The blog's title and standfirst are
under `site.blog`.
