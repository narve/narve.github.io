# narve.github.io

Personal site and blog, built with [Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages.

Live at <https://narve.github.io>.

## Quick start

```sh
npm install
npx @11ty/eleventy --serve   # http://localhost:8080
```

Build once + index for search:

```sh
npx @11ty/eleventy
npx pagefind --site _site
```

## Writing a post

Posts live in `src/posts/` and use the filename convention `YYYY-MM-DD-slug.{md,html}`. The published URL is always `/YYYY/MM/DD/slug/` (computed from the post's `date`, not the filename — but keeping them aligned is good hygiene).

### Markdown post

```markdown
---
title: "My post"
date: 2026-05-17
description: "One-line summary used in feeds and search."
tags: [foo, bar]
---

Body in plain GitHub-flavored Markdown. **No Nunjucks/Liquid tags in the body** — that keeps the file portable to any other SSG.
```

### HTML post (raw-openable)

HTML posts are *complete, valid HTML documents* — open them directly in a browser and they render as standalone pages. The site build extracts metadata from `<meta>` tags and uses the inner HTML of `#blog-content` as the post body.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My HTML post</title>
  <meta name="description" content="Summary.">
  <meta property="article:published_time" content="2026-05-17T10:30:00+02:00">
  <meta property="article:tag" content="foo">
  <meta property="article:tag" content="bar">
</head>
<body>
  <header>Standalone-only chrome (invisible to the SSG)</header>
  <article id="blog-content">
    <p>This part becomes the post body.</p>
  </article>
  <footer>More standalone-only chrome</footer>
</body>
</html>
```

| Source `<meta>` / element              | Becomes front matter |
| -------------------------------------- | -------------------- |
| `<title>`                              | `title`              |
| `<meta name="description">`            | `description`        |
| `<meta property="article:published_time">` *or* `<time datetime="…">` | `date` |
| `<meta property="article:tag">` (repeatable) | `tags`         |

The selector is `#blog-content`. If absent, the entire `<body>` is used. The mapping lives in `.eleventy.js`.

## Scheduled (future-dated) posts

Set a post's `date` in the future and it becomes a scheduled draft:

- The HTML is still built at its date-based permalink, so you can share a preview link (the URL works even though the post is hidden everywhere else).
- It is excluded from the home page, tag pages, Atom feed, sitemap, and search index until the date arrives.
- The post itself renders a yellow "Scheduled post" notice so you don't forget.

To preview future posts as if they were live, use the preview scripts:

```sh
npm run serve:preview    # dev server with future posts visible
npm run build:preview    # one-off build with future posts visible
```

The deploy workflow runs on every push **and** weekly (Mondays 06:00 UTC) so a scheduled post goes live automatically once its date passes, even without a code change.

## Project layout

```
.eleventy.js                # Eleventy config + custom .html extension
package.json
.github/workflows/deploy.yml # Build + deploy to GitHub Pages
src/
  _data/site.json           # Global site metadata
  _includes/layouts/        # base.njk, post.njk, page.njk
  posts/
    posts.11tydata.js       # Per-directory data: layout, permalink, post tag
    *.md                    # Markdown posts
    *.html                  # Full standalone HTML posts
  assets/css/style.css
  index.njk                 # Home (post list)
  about.md                  # /about/
  tags.njk                  # /tags/ (tag index)
  tag.njk                   # /tags/<tag>/ (one page per tag, via pagination)
  search.njk                # /search/ (Pagefind UI)
  feed.njk                  # /feed.xml
  sitemap.njk               # /sitemap.xml
```

## Deployment

`.github/workflows/deploy.yml` runs on push to `master`: it installs dependencies, runs Eleventy, indexes with Pagefind, and publishes `_site/` via `actions/deploy-pages`. To go live, enable Pages → "GitHub Actions" in the repo settings.

## Portability

The repo is deliberately not tightly coupled to Eleventy:

- Markdown posts use plain GFM + standard `---` YAML front matter — readable by Hugo, Astro, Jekyll, Eleventy, Gatsby, etc.
- HTML posts use native HTML semantics (`<meta>`, `<title>`, `<time>`) — no SSG-specific syntax.
- The Eleventy-specific bits (`.eleventy.js`, `*.njk` templates, `*.11tydata.js`) are limited to the chrome, not the content.

A future migration replaces the chrome and ports the ~30-line HTML extension; posts move untouched.
