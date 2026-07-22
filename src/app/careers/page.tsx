import { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
    title: "Careers & Internships | Join the Legal Network",
    description: "Apply for legal internships, discover mentorship programs, and join the pan-African team at Pan Afric Law Firm.",
    keywords: [
        "legal jobs Ethiopia",
        "law internships Addis Ababa",
        "legal careers Africa",
        "attorney recruitment",
        "associate lawyer job Ethiopia",
        "legal mentorship programs"
    ]
};

export default function CareersPage() {
    return <CareersClient />;
}
