"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";
import { useViewportKeys } from "~/hooks/useViewportKeys";

export type BracketOption = {
  label: string;
  /** Shorter label used below the md breakpoint */
  shortLabel?: string;
  href: string;
  /** Opens in a new tab (http/mailto links) */
  external?: boolean;
};

interface BracketMenuProps {
  options: BracketOption[];
  /** Index the ❯ cursor rests on when nothing is hovered */
  restIndex?: number;
  size?: "sm" | "lg";
  orientation?: "row" | "column";
  /** Called when an option is followed, e.g. to close a menu sheet */
  onNavigate?: () => void;
  /** If set, options slide in one after another starting at this delay (s) */
  enterDelay?: number;
  /** Take h/l (or j/k) keys while the menu is on screen, without focus */
  viewportKeys?: boolean;
  className?: string;
  "aria-label"?: string;
}

// RPG-style menu: ❯ [ option ]  [ option ]. The cursor follows hover/focus,
// h/l or arrow keys move it, and it returns to `restIndex` on mouse leave.
export function BracketMenu({
  options,
  restIndex = 0,
  size = "lg",
  orientation = "row",
  onNavigate,
  enterDelay,
  viewportKeys = false,
  className,
  "aria-label": ariaLabel,
}: BracketMenuProps) {
  const reduce = useReducedMotion();
  const animateIn = enterDelay !== undefined && !reduce;
  const [active, setActive] = useState(restIndex);
  const refs = useRef<(HTMLAnchorElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => setActive(restIndex), [restIndex]);

  const move = (step: number) => {
    const next = (active + step + options.length) % options.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const vertical = orientation === "column";
  const nextKeys = vertical ? ["ArrowDown", "j"] : ["ArrowRight", "l"];
  const prevKeys = vertical ? ["ArrowUp", "k"] : ["ArrowLeft", "h"];

  const handleKey = (key: string) => {
    if (nextKeys.includes(key)) move(1);
    else if (prevKeys.includes(key)) move(-1);
    else return false;
    return true;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (handleKey(e.key)) e.preventDefault();
  };

  // Only the vim keys: arrows keep scrolling the page until the menu has focus
  useViewportKeys(
    listRef,
    (key) => !key.startsWith("Arrow") && handleKey(key),
    viewportKeys,
  );

  return (
    <ul
      ref={listRef}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setActive(restIndex)}
      aria-label={ariaLabel}
      className={cn(
        "flex font-mono",
        vertical ? "flex-col" : "flex-wrap",
        size === "lg"
          ? vertical
            ? "gap-y-4"
            : "gap-x-6 gap-y-3"
          : "gap-x-2 gap-y-1 md:gap-x-4",
        className,
      )}
    >
      {options.map((opt, i) => {
        const isActive = i === active;
        return (
          <motion.li
            key={opt.href}
            initial={
              animateIn
                ? { opacity: 0, x: vertical ? -16 : 0, y: vertical ? 0 : 8 }
                : false
            }
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              delay: (enterDelay ?? 0) + i * 0.04,
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link
              ref={(el) => {
                refs.current[i] = el;
              }}
              href={opt.href}
              onClick={onNavigate}
              {...(opt.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-current={i === restIndex ? "page" : undefined}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "group flex items-baseline gap-1 rounded-sm whitespace-nowrap transition-colors focus-visible:outline-none",
                size === "lg" ? "text-base md:text-lg" : "text-xs md:text-sm",
                isActive ? "text-cyan-300" : "text-slate-400",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "text-cyan-400 transition-opacity",
                  size === "lg" ? "w-3" : "w-2.5",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              >
                ❯
              </span>
              <span
                aria-hidden
                className={isActive ? "text-cyan-400" : "text-slate-600"}
              >
                [
              </span>
              <span
                className={cn(
                  "px-0.5",
                  isActive &&
                    "[text-shadow:0_0_12px_rgba(56,189,248,0.5)] group-focus-visible:underline group-focus-visible:underline-offset-4",
                )}
              >
                {opt.shortLabel ? (
                  <>
                    <span className="md:hidden">{opt.shortLabel}</span>
                    <span className="hidden md:inline">{opt.label}</span>
                  </>
                ) : (
                  opt.label
                )}
              </span>
              <span
                aria-hidden
                className={isActive ? "text-cyan-400" : "text-slate-600"}
              >
                ]
              </span>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
