import fetch from "isomorphic-fetch";
import { NextApiHandler } from "next";

import marked from "marked";
import prisma from "@lib/prisma";

const query = `
query PaginatedTransactions($cursor: String) {
    transactions(
        tags: {
            name: "App-Name",
            values: ["MirrorXYZ"]
        }
      first: 100
      sort:HEIGHT_ASC
      after: $cursor
    ) {

        edges {
          cursor
            node {
                id
              block {
                height
              }
            }
        }
    }
}
`;

type Publication = {
  name: string;
  link: string;
  createdAt: Date;
};

type Post = {
  title: string;
  content: string;
  publishedAt: Date;
  digest: string;
  link: string;
  originalDigest: string | null;
  cursor: string;
  publicationName: string;
  arweaveTx: string;
};

async function getArData(id: string, cursor: string) {
  return await fetch(`https://arweave.net/${id}`)
    .then((r: any) => r.json())
    .then((data: any) => {
      const publication: Publication = {
        name: data.content.publication,
        link: `https://${data.content.publication}.mirror.xyz`,
        createdAt: new Date(data.content.timestamp * 1000),
      };

      const post: Post = {
        title: data.content.title,
        content: marked(data.content.body),
        publishedAt: new Date(data.content.timestamp * 1000),
        digest: data.digest,
        arweaveTx: id,
        link: `${publication.link}/${data.originalDigest}`,
        originalDigest: data.originalDigest,
        publicationName: publication.name,
        cursor: cursor,
      };

      return { publication, post };
    })
    .catch((error: Error) => {
      console.log(error);
      return Promise.reject(["rejected", error]);
    });
}

async function getRawPostList(cursor: string) {
  return await fetch("https://arweave.net/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { cursor },
    }),
  })
    .then((r: any) => r.json())
    .then((data: any) => data.data.transactions.edges);
}

type PostModifyType = {
  post: Post;
  index: number;
  type: string;
};

async function getData(
  cursor: string = "",
  publications: Publication[],
  posts: Post[]
) {
  console.log("CURSOR AT", cursor);

  var edges: any[] = await getRawPostList(cursor);
  var lastElem = edges[edges.length - 1];

  while (lastElem && lastElem.cursor) {
    const pubAddArr: Publication[] = [];
    const postAddArr: Post[] = [];
    const postModifyArr: PostModifyType[] = [];

    const finished = await edges.map(async (edge) => {
      console.log("processing id", edge.node.id);
      const { publication, post } = await getArData(
        edge.node.id,
        edge.cursor
      ).catch(async (error: Error) => {
        return await getArData(edge.node.id, edge.cursor);
      });

      if (publications.findIndex((p) => p.name == publication.name) == -1) {
        pubAddArr.push(publication);
        publications.push(publication);
      }

      const modDigest = posts.findIndex(
        (p) => p.originalDigest == post.originalDigest
      );
      const modTitle = posts.findIndex(
        (p) =>
          p.publicationName == post.publicationName && p.title == post.title
      );

      // if (modDigest == -1) {
      if (modDigest == -1 && modTitle == -1) {
        postAddArr.push(post);
        posts.push(post);
      } else if (modDigest != -1) {
        postModifyArr.push({ post, index: modDigest, type: "digest" });
        // update the title in the local db to make sure we dont fail constraints

        // posts[modDigest].title = post.title;
      } else if (modTitle != -1) {
        postModifyArr.push({ post, index: modTitle, type: "title" });
        // posts[modTitle].originalDigest = post.originalDigest;
      } else {
        console.log("shouldnt happen");
      }
    });

    await Promise.all(finished).then(async () => {
      console.log(
        `inserting ${postAddArr.length} posts and ${pubAddArr.length} publishers`
      );

      await prisma.publication.createMany({
        data: pubAddArr,
      });

      await prisma.post
        .createMany({
          data: postAddArr,
        })
        .catch((err) => {
          console.log("post add arr");
          console.log(posts);
          console.log(err);
        });

      const modPromises = await postModifyArr.map(async (mod) => {
        const post = { ...mod.post, publishedAt: posts[mod.index].publishedAt };

        if (post.originalDigest) {
          if (mod.type == "digest") {
            return prisma.post
              .update({
                where: {
                  originalDigest: post.originalDigest,
                },
                data: { ...post },
              })
              .catch((err) => {
                console.log(
                  "original digest error for post",
                  post.originalDigest,
                  posts[mod.index].originalDigest
                );
                console.log(err);
              });
          } else {
            const result = await prisma.post.findFirst({
              where: {
                title: post.title,
                publicationName: post.publicationName,
              },
            });

            if (result) {
              return prisma.post
                .update({
                  where: {
                    id: result.id,
                  },
                  data: {
                    ...post,
                    originalDigest: posts[mod.index].originalDigest,
                  },
                })
                .catch((err) => {
                  console.log(
                    "title/pub name error for post",
                    post.originalDigest,
                    posts[mod.index].originalDigest,
                    post.title,
                    posts[mod.index].title,
                    post.publicationName,
                    posts[mod.index].publicationName
                  );
                  console.log(err);
                });
            } else {
              console.log(
                "didnt find matching post with title",
                post.title,
                "author",
                post.publicationName
              );
            }
          }
        }
      });

      await Promise.all(modPromises);

      edges = await getRawPostList(lastElem.cursor);
      lastElem = edges[edges.length - 1];
    });
  }

  console.log("finished processing mirror.xyz posts");
}

const main: NextApiHandler = async (req, res) => {
  const key = req.query.key as string;
  console.log("hit with key", key, process.env.UPDATE_KEY);

  if (key == process.env.UPDATE_KEY) {
    const publications = await prisma.publication
      .findMany()
      .catch((error) => []);
    const posts = await prisma.post
      .findMany({
        orderBy: { publishedAt: "desc" },
      })
      .catch((error) => []);

    var cursor = "";

    if (posts.length != 0) {
      console.log("latest post published at", posts[0].publishedAt);
      cursor = posts[0].cursor;
    }

    getData(cursor, publications, posts);
    return res.json({ status: "Processing Update" });
  } else {
    return res.status(401).json({ status: "No Access" });
  }
};

export default main;
