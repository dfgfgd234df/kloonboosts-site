import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/components/scroll";
import Script from "next/script";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kloonboosts - Premium Discord Server Upgrades",
  description: "Enhance your Discord server with premium boosts, member growth solutions, and reaction services. Get instant server upgrades, authentic members, and engagement boosting tools.",
  keywords: "Discord boosts, server upgrades, Discord members, Discord reactions, server boosting service, Discord engagement, premium Discord features",
  
  openGraph: {
    title: "Kloonboosts - Premium Discord Server Upgrades",
    description: "Enhance your Discord server with premium boosts, member growth solutions, and reaction services.",
    type: "website",
    url: "https://kloonboosts.com",
    images: [
      {
        url: "logo.png",
        width: 456,
        height: 485,
        alt: "Kloonboosts Logo",
      },
    ],
    siteName: "Kloonboosts",
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://kloonboosts.com",
  },
  icons: {
    icon: "logo.png",
    apple: "logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!overflow-x-hidden">
            <head>
        <link rel="preconnect" href="https://cdn.sellix.io" />
        <link rel="preconnect" href="https://cdn.sell.app" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        
        <link href="logo.png" rel="shortcut icon" type="image/x-icon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/logo.png" />

        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Kloonboosts",
              description:
                "Premium Discord server upgrades and boosting services",
              url: "https://kloonboosts.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://kloonboosts.com",
                "query-input": "name=search_term_string",
              },
            }),
          }}
        />

        <meta
          name="trustpilot-one-time-domain-verification-id"
          content="e5ce5161-51ef-4937-ba52-ea6944f30f76"
        />
      </head>
      <body className={outfit.className}>
        <SmoothScrolling>{children}</SmoothScrolling>
        
        {/* Load external scripts after content */}
        <Script
          src="https://cdn.sell.app/embed/script.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.sellix.io/static/js/embed.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://unpkg.com/aos@2.3.1/dist/aos.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
