import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);

test("RSS lists every published post newest first with absolute links", async () => {
  const contentDirectory = new URL("src/content/posts/", root);
  const files = (await readdir(contentDirectory)).filter((file) => file.endsWith(".mdx"));
  const posts = [];

  for (const file of files) {
    const source = await readFile(new URL(file, contentDirectory), "utf8");
    const frontmatter = source.split("---")[1] ?? "";
    if (/^draft:\s*true$/m.test(frontmatter)) continue;
    const date = frontmatter.match(/^date:\s*(.+)$/m)?.[1]?.trim();
    assert.ok(date, `Missing date in ${file}`);
    posts.push({ id: file.replace(/\.mdx$/, ""), date: new Date(date) });
  }

  posts.sort((a, b) => b.date.valueOf() - a.date.valueOf() || a.id.localeCompare(b.id));
  const rss = await readFile(new URL("rss.xml", dist), "utf8");
  const links = [...rss.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g)]
    .map((match) => match[1]);

  assert.deepEqual(links, posts.map(({ id }) => `https://dethanev.app/blog/${id}/`));
});

test("article output includes article metadata and BlogPosting data", async () => {
  const blogDirectory = new URL("blog/", dist);
  const routes = (await readdir(blogDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory());

  for (const route of routes) {
    const html = await readFile(new URL(`${route.name}/index.html`, blogDirectory), "utf8");
    assert.match(html, /property="og:type" content="article"/, route.name);
    assert.match(html, /property="article:published_time"/, route.name);
    assert.match(html, /"@type":"BlogPosting"/, route.name);
  }
});

test("article fallback images stay below 350 KiB", async () => {
  const blogDirectory = new URL("blog/", dist);
  const routes = (await readdir(blogDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory());

  for (const route of routes) {
    const html = await readFile(new URL(`${route.name}/index.html`, blogDirectory), "utf8");
    for (const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
      const image = path.join(dist.pathname, match[1]);
      assert.ok((await stat(image)).size <= 350 * 1024, `${match[1]} exceeds 350 KiB`);
    }
  }
});

test("public HTML contains no placeholder links or labels", async () => {
  const pages = ["index.html", "about/index.html", "blog/index.html", "now/index.html"];
  for (const page of pages) {
    const html = await readFile(new URL(page, dist), "utf8");
    assert.doesNotMatch(html, /href="#"|待補|total views/, page);
  }
});
