"use client";

import { useRef, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";
import { sidebarSections } from "~/_data/about-data";

type Node = (typeof sidebarSections)[number]["items"][number];
type Row = {
  key: string;
  prefix: string;
  label: string;
  path?: string;
  isFolder: boolean;
  color?: string;
};

// Flatten the about sidebar into `tree`-style rows (├── / └── / │)
function buildRows(nodes: Node[], prefix = ""): Row[] {
  return nodes.flatMap((node, i) => {
    const last = i === nodes.length - 1;
    const branch = last ? "└── " : "├── ";
    const isFolder = Boolean(node.items?.length);
    const name = node.path.split("/").pop() ?? node.title;
    const row: Row = {
      key: node.path,
      prefix: prefix + branch,
      label: isFolder ? `${name}/` : `${name}.ts`,
      path: isFolder ? undefined : node.path,
      isFolder,
      color: node.color,
    };
    const children = isFolder
      ? buildRows(node.items as Node[], prefix + (last ? "    " : "│   "))
      : [];
    return [row, ...children];
  });
}

const ROWS = buildRows(
  sidebarSections.filter((s) => !s.isContact).flatMap((s) => s.items),
);

// Folder tree of the about files, used in the mobile "switch file" screen
export function AboutFileTree({
  activeContentKey,
  onNavigate,
}: {
  activeContentKey: string;
  onNavigate: () => void;
}) {
  const reduce = useReducedMotion();
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const activePath = `/about/${activeContentKey}`;
  let fileIndex = -1;

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const step =
      e.key === "j" || e.key === "ArrowDown"
        ? 1
        : e.key === "k" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const list = links.current.filter(Boolean);
    const current = list.indexOf(document.activeElement as HTMLAnchorElement);
    const next = list[(current + step + list.length) % list.length];
    next?.focus();
  };

  return (
    <div className="font-mono">
      <p className="mb-2 text-base text-slate-500">~/about</p>
      <ul onKeyDown={onKeyDown} aria-label="About files" className="text-lg">
        {ROWS.map((row, i) => {
          const active = row.path === activePath;
          if (!row.isFolder) fileIndex += 1;
          const linkIndex = fileIndex;
          return (
            <motion.li
              key={row.key}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.35 + i * 0.035,
                duration: 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center whitespace-pre"
            >
              <span aria-hidden className="text-slate-600">
                {row.prefix}
              </span>
              {row.isFolder || !row.path ? (
                <span className={cn("py-1.5", row.color ?? "text-slate-300")}>
                  {row.label}
                </span>
              ) : (
                <Link
                  ref={(el) => {
                    links.current[linkIndex] = el;
                  }}
                  href={row.path}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "-mx-1 flex items-center gap-1.5 rounded-sm px-1 py-1.5 transition-colors focus-visible:bg-cyan-400/10 focus-visible:outline-none",
                    active
                      ? "text-cyan-300 [text-shadow:0_0_12px_rgba(56,189,248,0.5)]"
                      : "text-slate-300 active:text-cyan-300",
                  )}
                >
                  {row.label}
                  {active && (
                    <span aria-hidden className="text-cyan-400">
                      ❮
                    </span>
                  )}
                </Link>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
