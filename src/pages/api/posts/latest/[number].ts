import { NextApiHandler } from "next";
import { getLatestPosts } from "@app/features/posts";

const getPosts: NextApiHandler = async (req, res) => {
  const number = parseInt(req.query.number as string);
  const posts = await getLatestPosts(number);

  return res.json(posts);
};

export default getPosts;
