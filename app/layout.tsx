import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/scroll";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kloonboosts",
  description:
    "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!overflow-x-hidden">
      <head>
        <link href="logo.png" rel="shortcut icon" type="image/x-icon" />
        <meta property="og:image" content="logo.png" />
        <script src="https://cdn.sellix.io/static/js/embed.js" defer></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" defer></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.min.js" defer></script>
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" defer></script>
        <link href="https://cdn.sellix.io/static/css/embed.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>
      </head>
      <body className={outfit.className}>
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
