import React, { useState } from "react";

import { Publication } from ".prisma/client";
import fetch from "isomorphic-unfetch";

const Publishers = () => {
  const [publishers, setPublishers] = useState<Publication[]>();

  fetch("http://localhost:3000/api/publishers")
    .then((data: any) => data.json())
    .then((publishers: Publication[]) => setPublishers(publishers));
  //   _fetch("https://google.com");

  return (
    <div className="publishers">
      {publishers?.map((publisher) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", padding: ".25rem" }}
          >
            <h4 style={{ margin: 0, marginRight: ".25rem" }}>
              <a href={publisher.link}>{publisher.name}</a>
            </h4>{" "}
            -
            <a
              href={`/api/publisher/${publisher.name}/rss`}
              style={{ marginLeft: ".25rem" }}
            >
              RSS
            </a>
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

export default Publishers;
