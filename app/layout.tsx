import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThinkNodes - AI-Powered Study Coach",
  description:
    "Your personalized AI study companion that helps you create study plans, track progress, and improve your learning experience.",
  keywords: [
    "study coach",
    "AI learning",
    "education",
    "study planner",
    "learning assistant",
  ],
  authors: [{ name: "ThinkNodes Team" }],
  creator: "ThinkNodes",
  publisher: "ThinkNodes",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thinknodes.vercel.app",
    title: "ThinkNodes - AI-Powered Study Coach",
    description:
      "Your personalized AI study companion that helps you create study plans, track progress, and improve your learning experience.",
    siteName: "ThinkNodes",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ThinkNodes - AI-Powered Study Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ThinkNodes - AI-Powered Study Coach",
    description:
      "Your personalized AI study companion that helps you create study plans, track progress, and improve your learning experience.",
    images: ["/og-image.png"],
    creator: "@thinknodes",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#4F46E5", // Indigo-600 color
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
