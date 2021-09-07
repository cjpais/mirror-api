import prisma from "@lib/prisma";

export const getLatestPosts = async (number: number = 10) => {
  const posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: "desc" }],
    take: number,
  });

  return posts;
};
