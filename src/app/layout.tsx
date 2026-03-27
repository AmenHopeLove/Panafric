import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pan Afric Law Firm | Connecting Legal Expertise Across Africa",
  description: "A professional legal network and knowledge hub connecting legal professionals, businesses, and investors across Africa.",
  openGraph: {
    title: "Pan Afric Law Firm | Panafrican Legal Excellence",
    description: "The premier portal for cross-border legal collaboration in Africa.",
    url: "https://palf-web-platform.vercel.app",
    siteName: "Pan Afric Law Firm",
    images: [
      {
        url: "/og-image.png", // Assuming this will be generated or exists
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pan Afric Law Firm",
    description: "Connecting Legal Expertise Across Africa.",
    images: ["/og-image.png"],
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
