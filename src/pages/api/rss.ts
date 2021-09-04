import { NextApiHandler } from "next";

import prisma from "@lib/prisma";

import { Feed } from "feed";

const getAllPostsRSS: NextApiHandler = async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: [
      {
        publishedAt: "desc",
      },
    ],
  });

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

export default getAllPostsRSS;
