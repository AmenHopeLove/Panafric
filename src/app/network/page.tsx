import { Metadata } from "next";
import NetworkClient from "./NetworkClient";

export const metadata: Metadata = {
    title: "Legal Directory & Network | Connect with Professional Counsel",
    description: "Search and connect with top-tier licensed attorneys and legal professionals in Ethiopia and across the African continent.",
    keywords: [
        "Ethiopian lawyers directory",
        "legal directory Africa",
        "find attorney Addis Ababa",
        "African lawyers",
        "advocates in Ethiopia",
        "law firm network East Africa"
    ]
};

export default function NetworkPage() {
    return <NetworkClient />;
}
