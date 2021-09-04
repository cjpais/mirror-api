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

      const modIndex = posts.findIndex(
        (p) => p.originalDigest == post.originalDigest
      );
      if (modIndex == -1) {
        postAddArr.push(post);
        posts.push(post);
      } else {
        postModifyArr.push({ post, index: modIndex });
      }
    });

    await Promise.all(finished).then(async () => {
      console.log(
        `inserting ${postAddArr.length} posts and ${pubAddArr.length} publishers`
      );

      await prisma.publication.createMany({
        data: pubAddArr,
      });

      await prisma.post.createMany({
        data: postAddArr,
      });

      const modPromises = postModifyArr.map((mod) => {
        const post = { ...mod.post, publishedAt: posts[mod.index].publishedAt };

        if (post.originalDigest) {
          return prisma.post.update({
            where: {
              originalDigest: post.originalDigest,
            },
            data: { ...post },
          });
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
  const publications = await prisma.publication.findMany().catch((error) => []);
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
};

export default main;
