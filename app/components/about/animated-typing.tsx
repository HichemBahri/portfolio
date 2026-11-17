"use client";

import { useState, useEffect } from "react";
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

export function AnimatedTyping({
  text,
  language,
}: {
  text: string;
  language: string;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    setDisplayedText("");
    setIsTypingComplete(false);
    let i = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 12);

    return () => clearInterval(typingInterval);
  }, [text]);

  useEffect(() => {
    if (isTypingComplete) {
      setShowCursor(false);
      return;
    }

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isTypingComplete]);

  const textToRender = `${displayedText}${showCursor ? "▋" : ""}`;

  return (
    <SyntaxHighlighter
      language={language}
      style={syntaxTheme}
      className="py-4 px-1 md:px-4"
      customStyle={{
        margin: 0,
        background: "#0f172a",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        fontFamily: "monospace",
        lineHeight: "1.25rem",
      }}
      PreTag="div"
      showLineNumbers
      wrapLongLines={true}
      wrapLines={true}
    >
      {textToRender}
    </SyntaxHighlighter>
  );
}
