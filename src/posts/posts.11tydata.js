module.exports = {
  layout: "layouts/post.njk",
  tags: ["posts"],
  permalink: "/{{ page.date | date: '%Y/%m/%d' }}/{{ page.fileSlug }}/",
  eleventyComputed: {
    permalink: (data) => {
      const d = data.page.date instanceof Date ? data.page.date : new Date(data.page.date);
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `/${yyyy}/${mm}/${dd}/${data.page.fileSlug}/`;
    },
  },
};
