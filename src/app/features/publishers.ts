import prisma from "@lib/prisma";
import { Post } from ".prisma/client";
import { sortPostDesc } from "./sort";

export const getPostsFromPublisher = async (name: string) => {
  const results = await prisma.post.findMany({
    orderBy: [{ createdAt: "desc" }],
    where: {
      publicationName: name,
    },
  });

  const postMap = new Map<string, Post[]>();

  results.map((post) => {
    if (post.originalDigest) {
      var curr = postMap.get(post.originalDigest);

      if (curr === undefined) {
        curr = [];
      }
      curr.push(post);

      postMap.set(post.originalDigest, curr);
    }
  });

  const posts: Post[] = [];

  postMap.forEach((value, key) => {
    value.sort(sortPostDesc);

    posts.push(value[0]);
  });

  posts.sort(sortPostDesc);

  return posts;
};
