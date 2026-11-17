"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { BracketMenu, type BracketOption } from "./ui/bracket-menu";

// Same destinations and labels as the standard navbar (nav.tsx)
const OPTIONS: BracketOption[] = [
  { label: "_hello", shortLabel: "hello", href: "/" },
  { label: "_about me", shortLabel: "about", href: "/about" },
  { label: "_projects", shortLabel: "projects", href: "/projects" },
  { label: "_contact-me", shortLabel: "contact", href: "/contact" },
];

const SHOW_AFTER = 120; // px scrolled before the dialog nav takes over

// Desktop only: once the page scrolls past the standard navbar, the nav becomes
// a floating dialog box (same style as the home page sign-off); at the top it
// goes away. On mobile the standard navbar is fixed instead (see nav.tsx).
export function FloatingNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setShown(y > SHOW_AFTER));

  const current = OPTIONS.findIndex((o) =>
    o.href === "/" ? pathname === "/" : pathname.startsWith(o.href),
  );

  return (
    <AnimatePresence>
      {shown && (
        <motion.nav
          aria-label="Main"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-x-0 top-3 z-50 hidden justify-center px-3 md:flex"
        >
          <div className="pointer-events-auto rounded-sm border-2 border-cyan-400/40 bg-[#101822]/95 px-3 py-2 shadow-[4px_4px_0_0_rgba(33,219,219,0.18)] backdrop-blur md:px-5 md:py-2.5">
            <BracketMenu
              options={OPTIONS}
              restIndex={Math.max(0, current)}
              size="sm"
              className="flex-nowrap"
              aria-label="Main navigation"
            />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
