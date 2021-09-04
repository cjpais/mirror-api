import { NextApiHandler } from "next";

import { Feed } from "feed";
import { getAllLatestPosts } from "@app/features/posts";

const getAllPosts: NextApiHandler = async (req, res) => {
  const posts = await getAllLatestPosts();

  return res.json(posts);
};

export default getAllPosts;
