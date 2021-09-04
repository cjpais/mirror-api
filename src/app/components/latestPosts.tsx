import React, { useEffect, useState } from "react";

import { Post } from ".prisma/client";
import fetch from "isomorphic-unfetch";
import TimeAgo from "react-timeago";

const LatestPosts = () => {
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    fetch(`/api/posts/latest`)
      .then((data: any) => data.json())
      .then((posts: Post[]) => setPosts(posts));
  }, []);

  return (
    <div className="posts">
      {posts?.map((post) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              padding: ".25rem",
            }}
            key={post.originalDigest}
          >
            <h4 style={{ margin: 0, paddingRight: ".5rem" }}>
              <a href={`${post.link}`}>{post.title}</a>
            </h4>{" "}
            by
            <h4
              style={{
                margin: 0,
                paddingLeft: ".5rem",
                paddingRight: ".5rem",
              }}
            >
              <a href={`https://${post.publicationName}.mirror.xyz/`}>
                {post.publicationName}
              </a>
            </h4>
            <TimeAgo
              date={post.publishedAt}
              style={{ marginLeft: "auto" }}
            ></TimeAgo>
          </div>
        );
      })}
      <style jsx>{`
        .posts {
        }
      `}</style>
    </div>
  );
};

export default LatestPosts;
