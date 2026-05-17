/**
 * Per-directory defaults for everything in src/posts/.
 *
 * Eleventy auto-merges this file's exports into the data cascade for every
 * file in the same directory, so individual posts don't need to repeat
 * `layout:` / `tags:` / `permalink:` boilerplate in their front matter.
 *
 * The permalink is computed from `page.date` (NOT from the filename) so
 * that adjusting a post's date in front matter automatically moves its URL.
 * Keeping the filename `YYYY-MM-DD-slug.{md,html}` aligned with `date` is
 * just a hygiene convention; the build doesn't enforce it.
 *
 * Future-dated posts ("scheduled drafts"):
 *   - The HTML file is still built at its date-based permalink, so the URL
 *     works if you know it (handy for sharing a preview link).
 *   - But the post is excluded from `collections.*`, so it doesn't appear
 *     on the home page, in tag pages, in the Atom feed, or in the sitemap.
 *   - The Pagefind search index is built from `[data-pagefind-body]`; the
 *     post layout omits that attribute for future posts (see post.njk), so
 *     scheduled drafts also don't show up in search.
 *   - Set `INCLUDE_FUTURE=1` in the environment to override and include
 *     future posts in everything (used by the `*:preview` npm scripts).
 *
 * For scheduled posts to "go live" automatically without a code push, the
 * deploy workflow runs on a weekly cron — see .github/workflows/deploy.yml.
 */

const INCLUDE_FUTURE = !!process.env.INCLUDE_FUTURE;

function toDate(d) {
  return d instanceof Date ? d : new Date(d);
}

function isFutureDate(d) {
  return toDate(d).getTime() > Date.now();
}

module.exports = {
  layout: "layouts/post.njk",
  // The "posts" tag is how Eleventy's `collections.posts` gets populated.
  // It is filtered out of the user-visible tag list (see .eleventy.js).
  tags: ["posts"],
  eleventyComputed: {
    isFuture: (data) => isFutureDate(data.page.date),
    eleventyExcludeFromCollections: (data) =>
      !INCLUDE_FUTURE && isFutureDate(data.page.date),
    permalink: (data) => {
      const d = toDate(data.page.date);
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `/${yyyy}/${mm}/${dd}/${data.page.fileSlug}/`;
    },
  },
};
