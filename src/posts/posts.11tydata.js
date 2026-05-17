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
 */
module.exports = {
  layout: "layouts/post.njk",
  // The "posts" tag is how Eleventy's `collections.posts` gets populated.
  // It is filtered out of the user-visible tag list (see .eleventy.js).
  tags: ["posts"],
  eleventyComputed: {
    permalink: (data) => {
      const d =
        data.page.date instanceof Date
          ? data.page.date
          : new Date(data.page.date);
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `/${yyyy}/${mm}/${dd}/${data.page.fileSlug}/`;
    },
  },
};
