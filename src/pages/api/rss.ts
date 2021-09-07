import { NextApiHandler } from "next";

import prisma from "@lib/prisma";

import { Feed } from "feed";
import { getLatestPosts } from "@app/features/posts";

const getPostsRSS: NextApiHandler = async (req, res) => {
  const posts = await getLatestPosts(30);

  const feed = new Feed({
    title: `MirrorXYZ`,
    description: `RSS Feed for Mirror.xyz`,
    id: `https://mirror.xyz`,
    link: `https://mirror.xyz`,
    language: "en",
    favicon: `https://mirror.xyz/icon/favicon-32x32.png`,
    updated: new Date(),
    copyright: `All rights reserved - MirrorXYZ`,
  });

  posts.map((post) => {
    feed.addItem({
      title: post.title,
      id: post.link,
      link: post.link,
      content: post.content,
      author: [
        {
          name: post.publicationName,
          link: `https://${post.publicationName}.mirror.xyz`,
        },
      ],
      date: post.publishedAt,
    });
  });

  return res.send(feed.rss2());
};

export default getPostsRSS;
