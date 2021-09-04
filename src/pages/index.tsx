import Publishers from "@app/components/publishers";
import LatestPosts from "@app/components/latestPosts";
import React from "react";

const Index = () => {
  return (
    <div className="index">
      <h1>LATEST MIRRORXYZ UPDATES</h1>
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
