"use client";

import React from "react";
import MDEditor from "@uiw/react-md-editor";

const CoverLetterPreview = ({ content }) => {
  if (!content) {
    return <p className="text-sm text-muted-foreground">This letter has no content yet.</p>;
  }

  return (
    <article data-color-mode="light" className="rounded-xl border bg-card px-6 py-8 sm:px-12 sm:py-12">
      <MDEditor.Markdown
        source={content}
        className="mx-auto max-w-[65ch]"
        style={{ background: "transparent", fontSize: "16px", lineHeight: 1.7 }}
      />
    </article>
  );
};

export default CoverLetterPreview;
