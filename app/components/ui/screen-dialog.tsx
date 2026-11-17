"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

// A text button in the bracket style: [ label ]
export function BracketButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-baseline gap-1 rounded-sm px-2 py-2 font-mono text-sm text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none active:translate-y-px",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="text-cyan-400">
        [
      </span>
      <span className="px-0.5">{children}</span>
      <span aria-hidden className="text-cyan-400">
        ]
      </span>
    </button>
  );
}

// CRT power-on animation of the screen (ScreenShell)
const SCREEN_ON_MS = 250;

interface ScreenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Small `// hint` line under the title */
  hint?: string;
  /** Element that opens the dialog (rendered as the Sheet trigger) */
  trigger?: ReactNode;
  children: ReactNode;
  /** Classes for the content area under the title */
  bodyClassName?: string;
}

// Full-screen retro "screen" dialog used on mobile: powers on like a CRT,
// types its title, and closes with a [ close ] button in the top-right.
export function ScreenDialog({
  open,
  onOpenChange,
  title,
  hint,
  trigger,
  children,
  bodyClassName,
}: ScreenDialogProps) {
  // The screen is opaque and full-size, but the page under it kept animating
  // (the hero synthwave canvas in particular), which made opening and using
  // the menu lag on phones. While open:
  // - data-screen-open (at once): animations check it and pause
  // - data-screen-covered (after the power-on animation): CSS hides <main>,
  //   so the covered page isn't painted at all (global.css)
  // Both are removed as soon as it closes, before the close animation.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.screenOpen = "";
    const covered = window.setTimeout(() => {
      root.dataset.screenCovered = "";
    }, SCREEN_ON_MS);
    return () => {
      window.clearTimeout(covered);
      delete root.dataset.screenOpen;
      delete root.dataset.screenCovered;
    };
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      {/* No dim overlay: the screen is opaque and full size, so fading a
          backdrop behind it was only extra compositing on phones */}
      <SheetContent
        side="right"
        overlay={false}
        className="inset-0 h-[100dvh] w-full max-w-none border-l-0 bg-transparent p-0 font-mono shadow-none data-[state=closed]:[--tw-exit-translate-x:0] data-[state=open]:[--tw-enter-translate-x:0] sm:max-w-none [&>button:last-child]:hidden"
      >
        <ScreenShell title={title} hint={hint} bodyClassName={bodyClassName}>
          {children}
        </ScreenShell>
      </SheetContent>
    </Sheet>
  );
}

function ScreenShell({
  title,
  hint,
  children,
  bodyClassName,
}: Pick<ScreenDialogProps, "title" | "hint" | "children" | "bodyClassName">) {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(reduce ? title.length : 0);

  // Title types itself once the screen has powered on
  useEffect(() => {
    if (reduce) return;
    let t: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      t = setInterval(() => {
        setTyped((n) => {
          if (n >= title.length) clearInterval(t);
          return Math.min(title.length, n + 1);
        });
      }, 25);
    }, 180);
    return () => {
      clearTimeout(start);
      clearInterval(t);
    };
  }, [reduce, title]);

  return (
    <motion.div
      initial={reduce ? false : { scaleY: 0.004, opacity: 0.6 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.7, 0, 0.3, 1] }}
      className="relative flex h-full flex-col overflow-y-auto bg-[#101822] px-6 pb-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_3px)]"
      />

      {/* Sticky so [ close ] never scrolls away; lines up with the mobile
          navbar's [ menu ] button. Spans the padding so content passes under it. */}
      <div className="sticky top-0 z-10 -mx-6 flex h-12 shrink-0 items-center justify-end bg-[#101822] pr-3 pl-6">
        <SheetClose asChild>
          <BracketButton>close</BracketButton>
        </SheetClose>
      </div>

      <SheetHeader className="relative mt-10 p-0 text-left">
        <SheetTitle className="font-mono text-4xl font-semibold text-slate-100">
          <span className="sr-only">{title}</span>
          <span aria-hidden>
            {title.slice(0, typed)}
            <span className="ml-1 inline-block h-[0.9em] w-[0.45em] translate-y-[0.1em] bg-cyan-400/80 motion-safe:animate-[blink_1.2s_step-end_infinite]" />
          </span>
        </SheetTitle>
      </SheetHeader>
      {hint && (
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.2 }}
          className="relative mt-2 text-xs text-slate-500"
        >
          {`// ${hint}`}
        </motion.p>
      )}

      <div className={cn("relative mt-12 flex flex-1 flex-col", bodyClassName)}>
        {children}
      </div>
    </motion.div>
  );
}
