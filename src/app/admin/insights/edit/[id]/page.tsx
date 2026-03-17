"use client";

import InsightsEditor from "../../editor";

export default function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
    return <InsightsEditor params={params} />;
}
