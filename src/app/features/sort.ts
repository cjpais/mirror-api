import { Post } from ".prisma/client";

export const sortPostDesc = (a: Post, b: Post) => {
  return a.publishedAt < b.publishedAt ? 1 : -1;
};
