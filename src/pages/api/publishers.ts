import { NextApiHandler } from "next";

import prisma from "@lib/prisma";

const getPublishers: NextApiHandler = async (req, res) => {
  const results = await prisma.publication.findMany({
    orderBy: [{ createdAt: "asc" }],
  });
  return res.json(results);
};

export default getPublishers;
