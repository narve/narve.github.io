const fs = require("node:fs/promises");
const htmlParser = require("node-html-parser");
const rssPlugin = require("@11ty/eleventy-plugin-rss");

const CONTENT_SELECTOR = "#blog-content";

function getAttr(node, name) {
  return node ? node.getAttribute(name) : undefined;
}

function readMeta(root, selector) {
  return getAttr(root.querySelector(selector), "content");
}

function readMetaAll(root, selector) {
  return root
    .querySelectorAll(selector)
    .map((n) => n.getAttribute("content"))
    .filter(Boolean);
}

function extractMetadata(root) {
  const data = {};
  const title = root.querySelector("title");
  if (title) data.title = title.text.trim();

  const description = readMeta(root, 'meta[name="description"]');
  if (description) data.description = description;

  const date =
    readMeta(root, 'meta[property="article:published_time"]') ||
    getAttr(root.querySelector("time[datetime]"), "datetime");
  if (date) data.date = date;

  const tags = readMetaAll(root, 'meta[property="article:tag"]');
  if (tags.length) data.tags = tags;

  return data;
}

function extractContent(root) {
  const node =
    root.querySelector(CONTENT_SELECTOR) || root.querySelector("body");
  return node ? node.innerHTML : root.toString();
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Take over .html handling: <meta>-driven front matter + #blog-content selector.
  eleventyConfig.addExtension("html", {
    read: true,
    getData: true,
    async getData(inputPath) {
      const raw = await fs.readFile(inputPath, "utf8");
      const root = htmlParser.parse(raw);
      const data = extractMetadata(root);
      if (!data.layout) data.layout = "layouts/post.njk";
      return data;
    },
    compile(inputContent) {
      const root = htmlParser.parse(inputContent);
      const body = extractContent(root);
      return () => body;
    },
  });

  // Flat list of all tags (excluding the "posts" collection tag).
  eleventyConfig.addCollection("tagList", (api) => {
    const set = new Set();
    api.getAll().forEach((item) => {
      (item.data.tags || [])
        .filter((t) => t && t !== "posts")
        .forEach((t) => set.add(t));
    });
    return [...set].sort();
  });

  eleventyConfig.addFilter("filterTagList", (tags) =>
    (tags || []).filter((t) => t && t !== "posts" && t !== "all")
  );

  eleventyConfig.addFilter("readableDate", (d) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("htmlDateString", (d) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString();
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
