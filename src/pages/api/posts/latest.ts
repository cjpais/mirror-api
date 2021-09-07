import { NextApiHandler } from "next";
import { getLatestPosts } from "@app/features/posts";

const getLatestPostsAPI: NextApiHandler = async (req, res) => {
  const posts = await getLatestPosts();

  return res.json(posts);
};

export default getLatestPostsAPI;
