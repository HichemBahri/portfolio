"use client";

import ReactMarkdown from "react-markdown";
import { markdownComponents } from "~/components/markdown-renderers";
import remarkGfm from "remark-gfm";

export function ProjectShowcase({
  markdownContent,
}: {
  markdownContent: string;
}) {
  return (
    <div className="prose prose-invert prose-sm max-w-4xl mx-auto text-xs md:text-base">
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
