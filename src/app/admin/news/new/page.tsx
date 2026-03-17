"use client";

import NewsEditor from "../editor";

export default function NewNewsArticle() {
    // Use a null params for new articles
    return <NewsEditor params={Promise.resolve({})} />;
}
