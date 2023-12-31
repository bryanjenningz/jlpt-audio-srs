import Head from "next/head";
import { type AppType } from "next/dist/shared/lib/utils";
import { useEffect } from "react";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/service-worker.mjs");
    }
  }, []);

  return (
    <>
      <Head>
        <title>JLPT Audio SRS</title>
        <meta
          name="description"
          content="Learn and review JLPT vocab by just listening."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#333" />
        <link rel="manifest" href="/app.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
