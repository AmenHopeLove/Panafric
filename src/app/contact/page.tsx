import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contact Us | Legal Consultation in Addis Ababa & Africa",
    description: "Contact our offices in Addis Ababa, Ethiopia. Initiate consultation or start case representation with our expert legal team.",
    keywords: [
        "contact Ethiopian lawyer",
        "legal advice Addis Ababa",
        "law firm address Ethiopia",
        "consult attorney",
        "Kirkos sub-city lawyers office",
        "PALF phone number"
    ]
};

export default function ContactPage() {
    return <ContactClient />;
}
