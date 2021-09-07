import { NextApiHandler } from "next";
import { getPostsFromPublisher } from "@app/features/publishers";

import { Feed } from "feed";

const getPublisherPosts: NextApiHandler = async (req, res) => {
  const name = req.query.name as string;

  const posts = await getPostsFromPublisher(name);

  const feed = new Feed({
    title: `${name} - MirrorXYZ`,
    description: `RSS Feed for ${name} on Mirror.xyz`,
    id: `https://${name}.mirror.xyz`,
    link: `https://${name}.mirror.xyz`,
    language: "en",
    favicon: `https://${name}.mirror.xyz/icon/favicon-32x32.png`,
    updated: new Date(),
    copyright: `All rights reserved - ${name}`,
  });

  posts.map((post) => {
    feed.addItem({
      title: post.title,
      id: post.link,
      link: post.link,
      content: post.content,
      author: [
        { name: post.publicationName, link: `https://${name}.mirror.xyz` },
      ],
      date: post.publishedAt,
    });
  });

  return res.send(feed.rss2());
};

export default getPublisherPosts;
