import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: "About Us | Pan-African & Ethiopian Legal Expertise",
    description: "Learn about Pan Afric Law Firm, our commitment to cross-border legal collaboration, and our leadership in Ethiopian and African corporate law.",
    keywords: [
        "Ethiopian law firm",
        "Addis Ababa legal services",
        "corporate lawyer Ethiopia",
        "Pan-African legal network",
        "business setup Ethiopia",
        "arbitration Addis Ababa"
    ]
};

export default function AboutPage() {
    return <AboutClient />;
}
