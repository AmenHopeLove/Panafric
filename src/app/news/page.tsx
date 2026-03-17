import { Metadata } from "next";
import NewsClient from "./NewsClient";

export const metadata: Metadata = {
    title: "News & Legal Updates | Pan Afric Law Firm",
    description: "Stay informed with the latest firm news, legal alerts, and press releases from Pan Afric Law Firm & Network.",
};

export default function NewsPage() {
    return <NewsClient />;
}
