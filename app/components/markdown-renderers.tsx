"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { CodeBlock } from "~/components/ui/code-block";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

const MarkdownCodeBlock = ({ node, ...props }: any) => {
  if (node?.children[0]?.tagName !== "code") {
    return <pre {...props} />;
  }
  const codeNode = node.children[0];
  const codeString = codeNode.children[0]?.value ?? "";
  const languageMeta = codeNode.properties?.className?.[0] ?? "";

  const langMatch = languageMeta.match(/^language-(\w+)/);
  const language = langMatch ? langMatch[1] : "plaintext";

  const highlightMatch = languageMeta.match(/\{(.+?)\}/);
  const highlightLines = highlightMatch ? highlightMatch[1] : null;

  const filenameMatch = languageMeta.match(/\[(.+?)\]/);
  const filename = filenameMatch ? filenameMatch[1] : null;

  return (
    <div className="my-6">
      <CodeBlock
        code={codeString.trim()}
        language={language}
        filename={filename}
        highlightLines={highlightLines}
        {...props}
      />
    </div>
  );
};

const MarkdownImage = ({ node, ...props }: any) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!props.src) {
    return null;
  }

  return (
    <>
      <div className="my-6 flex justify-center">
        <Image
          {...props}
          width={800}
          height={450}
          className="border-muted/50 cursor-pointer rounded-lg border shadow-lg transition-transform hover:scale-105"
          onClick={() => setModalOpen(true)}
        />
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="!w-[90vw] !max-w-[90vw] border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{props.alt}</DialogTitle>
          <Image
            {...props}
            width={1920}
            height={1080}
            className="h-auto max-h-[85vh] w-full object-contain"
            sizes="90vw"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const markdownComponents: Record<string, React.ComponentType<any>> = {
  h1: ({ node, ...props }) => (
    <h1
      className="mt-2 flex scroll-m-20 items-center gap-3 pb-2 font-semibold tracking-tight text-white before:text-blue-400 before:content-['#']"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      className="border-lines mt-10 flex scroll-m-20 items-center gap-3 border-t pt-6 font-semibold tracking-tight text-white before:text-green-400 before:content-['##']"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="mt-8 flex scroll-m-20 items-center gap-3 text-lg font-semibold tracking-tight text-white before:text-yellow-400 before:content-['###']"
      {...props}
    />
  ),
  h4: ({ node, ...props }) => (
    <h4
      className="mt-8 flex scroll-m-20 items-center gap-3 text-base font-semibold tracking-tight text-white before:text-orange-400 before:content-['####']"
      {...props}
    />
  ),
  p: ({ node, ...props }) => {
    // Fix for hydration error: unwrap block elements from p tags
    const firstChild = node.children[0];
    if (
      node.children.length === 1 &&
      firstChild.type === "element" &&
      ["table", "pre", "img"].includes(firstChild.tagName)
    ) {
      return <>{props.children}</>;
    }
    // Images render as a <div>, so a paragraph mixing an image with text
    // (e.g. an image followed by a caption) must not be a <p> either
    if (
      node.children.some(
        (child: any) => child.type === "element" && child.tagName === "img",
      )
    ) {
      return (
        <div
          className="text-muted-foreground leading-7 [&:not(:first-child)]:mt-6"
          {...props}
        />
      );
    }
    return (
      <p
        className="text-muted-foreground leading-7 [&:not(:first-child)]:mt-6"
        {...props}
      />
    );
  },
  a: ({ node, ...props }) => (
    <a
      className="text-primary font-medium underline underline-offset-4"
      {...props}
    />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="text-muted-foreground mt-6 border-l-2 pl-6 italic"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul
      className="before:bg-lines relative my-4 pl-8 before:absolute before:top-0 before:left-3 before:h-full before:w-px"
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="before:bg-lines relative my-4 pl-8 [counter-reset:list-counter] before:absolute before:top-0 before:left-3 before:h-full before:w-px"
      {...props}
    />
  ),
  li: ({ node, ordered, ...props }) => {
    return (
      <li
        className={
          ordered
            ? `before:text-secondary relative list-none py-1 before:absolute before:top-[0.25rem] before:left-[-1.75rem] before:w-6 before:text-right before:[content:counter(list-counter)_'.'] before:[counter-increment:list-counter]`
            : `before:text-accent relative list-none py-1 before:absolute before:top-[0.55rem] before:left-[-1.25rem] before:content-['▸']`
        }
        {...props}
      />
    );
  },
  strong: ({ node, ...props }) => (
    <strong
      className="font-semibold text-blue-400 drop-shadow-[0_0_4px_rgba(96,165,250,0.6)]"
      {...props}
    />
  ),
  img: MarkdownImage,
  code: ({ node, ...props }) => (
    <Badge
      variant="outline"
      className="bg-muted/30 border-green-500/40 px-2 py-0.5 font-mono text-xs text-green-300"
      {...props}
    />
  ),
  pre: MarkdownCodeBlock,

  // ---------- Table ----------
  table: ({ children, ...props }) => (
    <div className="bg-muted/10 my-6 overflow-hidden rounded-xl shadow-md">
      <Table className="w-full text-sm">{children}</Table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <TableHeader
      className="bg-muted/40 text-xs tracking-wide text-white uppercase"
      {...props}
    >
      {children}
    </TableHeader>
  ),
  tbody: ({ children, ...props }) => (
    <TableBody className="divide-muted/30 divide-y" {...props}>
      {children}
    </TableBody>
  ),
  tr: ({ children, ...props }) => (
    <TableRow
      className="even:bg-muted/10 hover:bg-muted/20 h-auto transition-colors"
      {...props}
    >
      {children}
    </TableRow>
  ),
  th: ({ children, ...props }) => (
    <TableHead
      className="h-auto px-4 py-1.5 text-left font-semibold text-blue-400"
      {...props}
    >
      {children}
    </TableHead>
  ),
  td: ({ children, ...props }) => (
    <TableCell
      className="text-muted-foreground h-auto px-4 py-1.5 font-mono"
      {...props}
    >
      {children}
    </TableCell>
  ),
};