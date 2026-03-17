import { Metadata } from "next";
import InsightsClient from "./InsightsClient";

export const metadata: Metadata = {
    title: "Legal Insights & Knowledge Hub | Pan Afric Law Firm",
    description: "Intelligence for a changing continent. Curated expert analysis, regulatory updates, and legal insights from Pan Afric Law Firm.",
};

export default function InsightsPage() {
    return <InsightsClient />;
}
