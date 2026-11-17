"use client";
import { ScrollArea } from "../ui/scroll-area";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { type CSSProperties } from "react";

const syntaxTheme: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: "var(--sh-parameter)",
    fontFamily:
      'var(--font-fira-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "14px",
    lineHeight: "1.5",
  },
  'pre[class*="language-"]': {
    color: "var(--sh-parameter)",
    fontFamily:
      'var(--font-fira-code), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "14px",
    lineHeight: "1.5",
    padding: "1em",
    margin: ".5em 0",
    overflow: "auto",
    borderRadius: "var(--radius)",
  },
  comment: { color: "var(--sh-comment)" },
  prolog: { color: "var(--sh-comment)" },
  doctype: { color: "var(--sh-comment)" },
  cdata: { color: "var(--sh-comment)" },
  punctuation: { color: "var(--sh-punctuation)" },
  property: { color: "var(--sh-property)" },
  tag: { color: "var(--sh-keyword)" },
  boolean: { color: "var(--sh-keyword)" },
  number: { color: "var(--sh-keyword)" },
  constant: { color: "var(--sh-keyword)" },
  symbol: { color: "var(--sh-keyword)" },
  deleted: { color: "var(--sh-keyword)" },
  selector: { color: "var(--sh-string)" },
  "attr-name": { color: "var(--sh-string)" },
  string: { color: "var(--sh-string)" },
  char: { color: "var(--sh-string)" },
  builtin: { color: "var(--sh-string)" },
  inserted: { color: "var(--sh-string)" },
  operator: { color: "var(--sh-punctuation)" },
  entity: { color: "var(--sh-punctuation)", cursor: "help" },
  url: { color: "var(--sh-string)" },
  variable: { color: "var(--sh-parameter)" },
  atrule: { color: "var(--sh-keyword)" },
  "attr-value": { color: "var(--sh-string)" },
  keyword: { color: "var(--sh-keyword)" },
  function: { color: "var(--sh-function)" },
  regex: { color: "var(--sh-string)" },
  important: { color: "var(--sh-keyword)", fontWeight: "bold" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};

type ContentPanelProps = {
  content: {
    language: string;
    content: string;
  };
};

export function ContentPanel({ content }: ContentPanelProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="md:p-4">
        <SyntaxHighlighter
          language={content.language}
          style={syntaxTheme}
          className="code-hang px-1 py-4 text-[13px] md:px-4 md:text-sm"
          customStyle={{
            margin: 0,
            background: "#0f172a",
            borderRadius: "0.5rem",
            fontFamily: "monospace",
            lineHeight: "1.25rem",
          }}
          codeTagProps={{
            className: `language-${content.language}`,
            style: { fontSize: "inherit" },
          }}
          lineNumberStyle={{ minWidth: "2.5em", paddingRight: "1em" }}
          PreTag="div"
          showLineNumbers
          wrapLongLines={true}
          wrapLines={true}
        >
          {content.content}
        </SyntaxHighlighter>
      </div>
    </ScrollArea>
  );
}
