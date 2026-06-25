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
  title: "Team Curran Jiu-Jitsu Academy | Crystal Lake, IL",
  description:
    "Brazilian Jiu-Jitsu, Muay Thai, and Junior BJJ programs in Crystal Lake, IL. Train under 5th Degree Black Belt Professor Jeff Curran. Start with a 2-week trial for $45.",
  icons: {
    icon: "/Team Curran C .png",
    apple: "/Team Curran C .png",
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
  return (
    <html
      lang="en"
      className={`${anton.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
