import { NextApiHandler } from "next";
import { getLatestPosts } from "@app/features/posts";

const getAllPosts: NextApiHandler = async (req, res) => {
  const posts = await getLatestPosts();

  return res.json(posts);
};

export default getAllPosts;
