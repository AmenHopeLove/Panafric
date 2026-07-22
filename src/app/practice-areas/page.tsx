import { Metadata } from "next";
import PracticeAreasClient from "./PracticeAreasClient";

export const metadata: Metadata = {
    title: "Practice Areas | Corporate, Trade & Litigation in Ethiopia",
    description: "Explore our specialized legal services in Ethiopia and across Africa, including corporate finance, international trade, commercial litigation, IP, and real estate.",
    keywords: [
        "corporate law Ethiopia",
        "commercial litigation Addis Ababa",
        "investment law Ethiopia",
        "intellectual property Ethiopia",
        "international trade law Africa",
        "tax advisory Addis Ababa"
    ]
};

export default function PracticeAreasPage() {
    return <PracticeAreasClient />;
}
