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
  metadataBase: new URL("https://www.panafriclawfirm.com"),
  title: {
    default: "Pan Afric Law Firm | Connecting Legal Expertise Across Africa",
    template: "%s | Pan Afric Law Firm & Network"
  },
  description: "A professional legal network and knowledge hub connecting legal professionals, businesses, and investors across Ethiopia and Africa. Specialized in corporate, trade, and dispute resolution.",
  keywords: [
    "Ethiopia legal", 
    "Ethiopian law firm", 
    "Addis Ababa lawyers", 
    "corporate law Ethiopia", 
    "investment legal services Ethiopia", 
    "corporate lawyer Ethiopia", 
    "Pan-African legal network", 
    "African law firm", 
    "intellectual property Ethiopia", 
    "tax lawyer Ethiopia", 
    "business setup Ethiopia", 
    "arbitration Addis Ababa"
  ],
  openGraph: {
    title: "Pan Afric Law Firm | Panafrican Legal Excellence",
    description: "The premier portal for cross-border legal collaboration and services in Ethiopia and Africa.",
    url: "https://www.panafriclawfirm.com",
    siteName: "Pan Afric Law Firm",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pan Afric Law Firm",
    description: "Connecting Legal Expertise Across Ethiopia and Africa.",
    images: ["/logo.png"],
  },
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Pan Afric Law Firm & Network (PALF)",
    "image": "https://www.panafriclawfirm.com/logo.png",
    "@id": "https://www.panafriclawfirm.com/#organization",
    "url": "https://www.panafriclawfirm.com",
    "telephone": "+251 900 000 000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bole Sub-City, Kirkos",
      "addressLocality": "Addis Ababa",
      "addressCountry": "ET"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.0192,
      "longitude": 38.7525
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:30",
      "closes": "17:30"
    },
    "sameAs": [
      "https://www.linkedin.com/company/pan-afric-law-firm",
      "https://twitter.com/panafriclaw"
    ],
    "priceRange": "$$$",
    "description": "Premium corporate, trade, and litigation legal services and professional lawyer directory in Addis Ababa, Ethiopia and across Africa."
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
