"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "~/lib/utils";
import type { Experience } from "~/_data/experience-data";

const CYAN = "33, 219, 219"; // snake colour
const PINK = "255, 161, 173"; // --sh-string

// Lane x positions inside the 48px gutter
const MAIN_X = 12;
const SIDE_X = 34;
const NODE_TOP = 26; // px from row top, level with the title line

const fmt = (ym: string) => {
  if (ym === "present") return "now";
  const [y, m] = ym.split("-");
  const month = new Date(Number(y), Number(m) - 1).toLocaleString("en-US", {
    month: "short",
  });
  return `${month} ${y}`;
};

export function TimelineGraph({
  experiences,
  className,
}: {
  experiences: Experience[];
  className?: string;
}) {
  const reduce = useReducedMotion();

  const list: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.14 } },
  };
  const line: Variants = {
    hidden: { scaleY: reduce ? 1 : 0 },
    show: { scaleY: 1, transition: { duration: 0.35, ease: "linear" } },
  };
  const node: Variants = {
    hidden: { scale: reduce ? 1 : 0 },
    show: {
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 18, delay: 0.2 },
    },
  };
  const text: Variants = {
    hidden: { opacity: reduce ? 1 : 0, x: reduce ? 0 : -8 },
    show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.15 } },
  };

  if (experiences.length === 0) {
    return (
      <p className={cn("text-syntax-comment font-mono text-sm", className)}>
        {"// no commits yet"}
      </p>
    );
  }

  return (
    <motion.ol
      className={className}
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {experiences.map((exp, i) => {
        const isLast = i === experiences.length - 1;
        const side = exp.lane === "side";
        const rgb = side ? PINK : CYAN;
        const isHead = exp.ref?.startsWith("HEAD");

        return (
          <motion.li
            key={`${exp.company}-${exp.start}`}
            variants={list}
            className="group grid grid-cols-[3rem_minmax(0,1fr)] md:grid-cols-[3rem_11rem_minmax(0,1fr)]"
          >
            {/* Graph gutter */}
            <div aria-hidden className="relative">
              {/* main lane runs through every row, ending at the root commit */}
              <motion.span
                variants={line}
                style={{
                  left: MAIN_X,
                  bottom: isLast ? undefined : 0,
                  height: isLast ? NODE_TOP : undefined,
                  backgroundColor: `rgba(${CYAN}, 0.35)`,
                }}
                className="absolute top-0 w-0.5 origin-top"
              />

              {/* side branch: from the commit down, then forks back into main */}
              {side && (
                <motion.svg
                  variants={line}
                  className="absolute left-0 w-12 origin-top"
                  style={{
                    top: NODE_TOP,
                    height: `calc(100% - ${NODE_TOP}px)`,
                  }}
                  viewBox="0 0 48 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d={`M${SIDE_X + 1} 0 L${SIDE_X + 1} 70 L${MAIN_X + 1} 100`}
                    fill="none"
                    stroke={`rgba(${PINK}, 0.5)`}
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                  />
                </motion.svg>
              )}

              {/* commit */}
              <motion.span
                variants={node}
                className="absolute size-3 rounded-[2px] transition-shadow"
                style={{
                  left: (side ? SIDE_X : MAIN_X) - 5,
                  top: NODE_TOP - 6,
                  backgroundColor: `rgb(${rgb})`,
                  boxShadow: `0 0 ${isHead ? 14 : 6}px rgba(${rgb}, ${isHead ? 0.8 : 0.4})`,
                }}
              />
            </div>

            {/* Dates (desktop column) */}
            <motion.p
              variants={text}
              className="hidden pt-4 font-mono text-sm text-slate-500 tabular-nums md:block"
            >
              {fmt(exp.start)} - {fmt(exp.end)}
            </motion.p>

            {/* Commit message */}
            <motion.div
              variants={text}
              className={cn("min-w-0 pt-4", isLast ? "pb-2" : "pb-8")}
            >
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-foreground text-base font-medium md:text-lg">
                  {exp.role}
                </span>
                <span className="text-muted-foreground">@</span>
                <Link
                  href={exp.aboutPath}
                  className="text-accent rounded-sm hover:underline focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
                >
                  {exp.company}
                </Link>
                {exp.ref && (
                  <span
                    className="font-mono text-xs"
                    style={{ color: `rgb(${rgb})` }}
                  >
                    ({exp.ref})
                  </span>
                )}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-500 tabular-nums md:hidden">
                {fmt(exp.start)} - {fmt(exp.end)}
              </p>
              <p className="text-muted-foreground mt-2 max-w-[65ch] text-sm leading-relaxed">
                {exp.summary}
              </p>
              {exp.project && (
                <Link
                  href={exp.project.href}
                  className="text-syntax-string mt-2 inline-block rounded-sm font-mono text-xs hover:brightness-125 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
                >
                  ~/projects/{exp.project.label}
                </Link>
              )}
            </motion.div>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
