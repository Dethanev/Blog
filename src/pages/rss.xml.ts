import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { sortPostsNewestFirst } from "~/lib/utils";

export const GET: APIRoute = async (context) => {
  const posts = sortPostsNewestFirst(
    await getCollection("posts", ({ data }) => !data.draft),
  );

  return rss({
    title: "Dethanev 開發室",
    description: "Dethanev 的 App、Web、Server、Side Project 與自架系統開發筆記。",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
    customData: "<language>zh-TW</language>",
  });
};
