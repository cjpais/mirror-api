import React, { useEffect, useState } from "react";

import { Publication } from ".prisma/client";
import fetch from "isomorphic-unfetch";

const Publishers = () => {
  const [publishers, setPublishers] = useState<Publication[]>();

  useEffect(() => {
    fetch(`/api/publishers`)
      .then((data: any) => data.json())
      .then((publishers: Publication[]) => setPublishers(publishers));
  }, []);

  return (
    <div className="publishers">
      {publishers?.map((publisher) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", padding: ".25rem" }}
            key={publisher.name}
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
      `}</style>
    </div>
  );
};

export default Publishers;
