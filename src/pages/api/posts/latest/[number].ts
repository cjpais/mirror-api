import { NextApiHandler } from "next";
import { getLatestPosts } from "@app/features/posts";

const getAllPosts: NextApiHandler = async (req, res) => {
  const number = parseInt(req.query.number as string);
  const posts = await getLatestPosts(number);

  return res.json(posts);
};

export default getAllPosts;
