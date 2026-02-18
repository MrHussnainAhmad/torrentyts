import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#171717" />
        <meta name="google-site-verification" content="GxoWjVvXFK0dKlz7eskpWguKgf0w2kF1oSZyaVUjtBg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
