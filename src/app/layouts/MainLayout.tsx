import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      {children}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        html,
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          margin: 0;
          padding: 0;
          font-size: 16px;
          line-height: 1.6;
          color: #666;
          background: #000000e0;
        }

        main {
          max-width: 40rem;
          margin: 0 auto;
        }

        h1 {
          font-weight: 700;
        }
        p {
          margin-bottom: 10px;
        }

        ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        input,
        textarea {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          margin: 0;
          padding: 0.25rem 0.5rem;
          font-size: 16px;
          line-height: 1.5;
        }

        @media screen and (max-width: 768px) {
          main {
            padding: 1.5rem;
          }
        }

        a {
          color: white;
        }
      `}</style>
    </main>
  );
};

export default MainLayout;
