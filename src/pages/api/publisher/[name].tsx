import { NextApiHandler } from "next";
import { getPostsFromPublisher } from "@app/features/publishers";

const getPublisherPosts: NextApiHandler = async (req, res) => {
  const name = req.query.name as string;

  const posts = await getPostsFromPublisher(name);

  return res.json(posts);
};

export default getPublisherPosts;
