"use client";

import NewsEditor from "../../editor";

export default function EditNewsArticle({ params }: { params: Promise<{ id: string }> }) {
    return <NewsEditor params={params} />;
}
