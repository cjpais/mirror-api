import Publishers from "@app/components/publishers";
import LatestPosts from "@app/components/latestPosts";
import React from "react";

const Index = () => {
  return (
    <div className="index">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>LATEST MIRRORXYZ UPDATES</h1>
        <a style={{ marginLeft: "auto" }} href="https://localhost:3000/api/rss">
          RSS
        </a>
      </div>
      <LatestPosts></LatestPosts>
      <h1>MIRRORXYZ - PUBLISHERS</h1>
      <Publishers></Publishers>
      <style jsx>{`
        .index {
        }
      `}</style>
    </div>
  );
};

export default Index;
