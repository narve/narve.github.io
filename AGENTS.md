# AGENTS.md — guidance for AI coding assistants

This is an Eleventy-based blog. The README has the user-facing overview; this file calls out conventions and footguns that aren't obvious from the code.

## Cardinal rules

1. **Markdown post bodies stay portable.** Plain GFM only — no Nunjucks/Liquid tags (`{{ … }}`, `{% … %}`) inside `.md` files. The point is that posts can move to another SSG with no rewrite. Templates and chrome go in `_includes/layouts/`, not in posts.

2. **HTML posts must remain valid standalone HTML files.** The whole reason `.html` posts exist as a separate format is that opening the source file directly in a browser should render a complete page. Don't add YAML front-matter fences to them. Don't strip the `<html>`/`<head>`/`<body>` wrapper. All metadata is conveyed via `<meta>` / `<title>` / `<time>` tags.

3. **`#blog-content` is the SSG-visible region.** Anything outside that element in an HTML post is "standalone-only chrome" and intentionally invisible to the build. If asked to add per-post navigation or styling that should appear on the published site, put it *inside* `#blog-content` or in a layout — not in the standalone chrome.

4. **Permalinks are date-derived.** Posts publish at `/YYYY/MM/DD/slug/`, computed from the `date` field by `src/posts/posts.11tydata.js`. Don't override `permalink` per-post unless the user explicitly asks for a custom URL.

## Where things live

| Concern | File |
| --- | --- |
| Custom `.html` extension (meta → front matter, selector → body) | `.eleventy.js` |
| Per-directory defaults for posts (layout, tags, permalink) | `src/posts/posts.11tydata.js` |
| Site title/URL/author | `src/_data/site.json` |
| Page chrome (header, nav, footer) | `src/_includes/layouts/base.njk` |
| Post wrapper (title, date, tag links) | `src/_includes/layouts/post.njk` |
| Tag listing logic | `.eleventy.js` (`tagList` collection) + `src/tag.njk` + `src/tags.njk` |
| Search | `src/search.njk` + Pagefind index built post-build |
| Feed / sitemap | `src/feed.njk` / `src/sitemap.njk` |
| Deploy | `.github/workflows/deploy.yml` (triggers on push to `master`) |

## The meta → front-matter mapping

Defined in `.eleventy.js` (`extractMetadata`). Adding a new field means:

1. Read it in `extractMetadata` and return it from `getData`.
2. Optionally consume it in `post.njk`.
3. Document it in the README table.

Prefer existing HTML standards over custom attribute names: OpenGraph (`og:*`), Article schema (`article:*`), Dublin Core, JSON-LD. The point of this design is that the metadata format is the web's, not Eleventy's.

## Common tasks

- **New post**: create `src/posts/YYYY-MM-DD-slug.md` (or `.html`). Build to verify URL and tag pages appeared.
- **New tag**: just add it to a post's `tags`. Tag pages auto-generate via the `tagList` collection.
- **New top-level page** (e.g. `/projects/`): create `src/projects.md` with `permalink: /projects/` and `layout: layouts/page.njk` in front matter.
- **Change site title/author**: edit `src/_data/site.json`.

## Build / verify locally

```sh
npx @11ty/eleventy            # build → _site/
npx pagefind --site _site     # index search → _site/pagefind/
```

For dev with live reload: `npx @11ty/eleventy --serve` (Pagefind index won't update under `--serve`; rerun the indexer manually if testing search).

## Things to NOT do

- Don't add CI/runtime dependencies that aren't on npm or that need native build tools beyond what's in the Ubuntu GH Actions runner.
- Don't introduce Liquid filters in post bodies — keep that scoped to layouts.
- Don't commit `_site/` or `node_modules/` (both in `.gitignore`).
- Don't change the deploy workflow's trigger branch without telling the user; `dev` is the working branch, `master` is publish.
