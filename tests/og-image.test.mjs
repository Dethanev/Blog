import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const imageURL = new URL("public/og-default.png", projectRoot);
const layoutURL = new URL("src/layouts/BaseLayout.astro", projectRoot);

test("shared OG image is social-card sized and lightweight", async () => {
  const [image, metadata] = await Promise.all([readFile(imageURL), stat(imageURL)]);

  assert.equal(image.toString("ascii", 1, 4), "PNG", "OG image must be a PNG");
  assert.equal(image.readUInt32BE(16), 1200, "OG image width must be 1200px");
  assert.equal(image.readUInt32BE(20), 630, "OG image height must be 630px");
  assert.ok(metadata.size <= 400 * 1024, "OG image should stay below 400 KiB");
});

test("layout publishes complete OG image metadata", async () => {
  const layout = await readFile(layoutURL, "utf8");

  for (const metadata of [
    'property="og:image:type"',
    'property="og:image:width"',
    'property="og:image:height"',
    'property="og:image:alt"',
    'name="twitter:image:alt"',
  ]) {
    assert.match(layout, new RegExp(metadata), `Missing ${metadata}`);
  }
});
