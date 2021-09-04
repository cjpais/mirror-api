import React, { useEffect, useState } from "react";

import prisma from "@lib/prisma";
import { Publication } from ".prisma/client";

const Publishers = () => {
  const [publishers, setPublishers] = useState<Publication[]>();

  prisma.publication.findMany({}).then((data) => setPublishers(data));

  return (
    <div className="publishers">
      {publishers?.map((publisher) => {
        return <a href={publisher.link}>{publisher.name}</a>;
      })}
      <style jsx>{`
        .publishers {
        }
      `}</style>
    </div>
  );
};

export default Publishers;
