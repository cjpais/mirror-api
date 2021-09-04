import React, { useState } from "react";

import { Post } from ".prisma/client";
import fetch from "isomorphic-unfetch";
import TimeAgo from "react-timeago";

const LatestPosts = () => {
  const [posts, setPosts] = useState<Post[]>();

  fetch("http://localhost:3000/api/posts/latest")
    .then((data: any) => data.json())
    .then((posts: Post[]) => setPosts(posts));

  return (
    <div className="publishers">
      {posts?.map((post) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              padding: ".25rem",
            }}
          >
            <h4 style={{ margin: 0, paddingRight: ".5rem" }}>
              <a href={`https://${post.link}`}>{post.title}</a>
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
            <TimeAgo date={post.publishedAt}></TimeAgo>
          </div>
        );
      })}
      <style jsx>{`
        .publishers {
        }

        a {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default LatestPosts;
