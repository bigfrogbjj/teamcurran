import type { Metadata, Viewport } from "next";
import { Anton, Oswald } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Team Curran Jiu-Jitsu Academy | Brazilian Jiu-Jitsu Crystal Lake, IL",
  description:
    "Brazilian Jiu-Jitsu, Muay Thai, and Kids BJJ in Crystal Lake, IL. Train under 5th Degree Pedro Sauer Black Belt Professor Jeff Curran. Serving Crystal Lake, Algonquin, Lake in the Hills, McHenry & Cary. 2-week trial $45.",
  keywords: "brazilian jiu jitsu crystal lake, BJJ crystal lake IL, jiu jitsu crystal lake, martial arts crystal lake IL, kids jiu jitsu crystal lake, muay thai crystal lake, Pedro Sauer, gracie jiu jitsu illinois",
  icons: {
    icon: "/Team Curran C .png",
    apple: "/Team Curran C .png",
  },
  openGraph: {
    title: "Team Curran Jiu-Jitsu Academy | Crystal Lake, IL",
    description: "Brazilian Jiu-Jitsu, Muay Thai & Kids BJJ in Crystal Lake, IL. Pedro Sauer lineage. 2-week trial $45.",
    url: "https://teamcurran.com",
    siteName: "Team Curran Jiu-Jitsu Academy",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Team Curran Jiu-Jitsu Academy",
    "description": "Brazilian Jiu-Jitsu, Muay Thai, and Kids BJJ in Crystal Lake, IL. Pedro Sauer Association member.",
    "url": "https://teamcurran.com",
    "telephone": "+18153560454",
    "email": "chuck@teamcurran.com",
    "foundingDate": "1997",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "102 W Woodstock St",
      "addressLocality": "Crystal Lake",
      "addressRegion": "IL",
      "postalCode": "60014",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 42.2214,
      "longitude": -88.3162
    },
    "sameAs": [
      "https://www.instagram.com/teamcurranbjj",
      "https://www.facebook.com/teamcurranbjj"
    ],
    "sport": ["Brazilian Jiu-Jitsu", "Muay Thai"],
    "priceRange": "$$",
    "areaServed": [
      "Crystal Lake, IL",
      "Algonquin, IL",
      "Lake in the Hills, IL",
      "Cary, IL",
      "McHenry, IL",
      "Woodstock, IL"
    ]
  };

  return (
    <html
      lang="en"
      className={`${anton.variable} ${oswald.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
