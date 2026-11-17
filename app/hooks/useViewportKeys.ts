"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Return true when the key was handled (the event is then prevented). */
export type ViewportKeyHandler = (key: string) => boolean;

type Entry = {
  ref: RefObject<HTMLElement | null>;
  handler: RefObject<ViewportKeyHandler>;
};

const entries = new Set<Entry>();

// Share of the element (or of the viewport, for tall elements) that must be
// on screen before it can receive keys.
const MIN_VISIBLE = 0.5;

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

// The registered element that fills the most of the viewport wins
function mostVisible() {
  const vh = window.innerHeight;
  let best: Entry | null = null;
  let bestPx = 0;
  for (const entry of entries) {
    const el = entry.ref.current;
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.height === 0) continue; // display:none (e.g. the other breakpoint)
    const px = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (px / Math.min(r.height, vh) < MIN_VISIBLE) continue;
    if (px > bestPx) {
      best = entry;
      bestPx = px;
    }
  }
  return best;
}

function onKeyDown(e: KeyboardEvent) {
  // The focused component already handled it, or the user is busy elsewhere
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
  if (isTyping(e.target)) return;
  if (document.activeElement?.closest('[role="dialog"]')) return;

  const entry = mostVisible();
  if (entry?.handler.current(e.key)) e.preventDefault();
}

/**
 * Lets a component take vim/arrow keys while it is the most visible keyboard
 * target on screen, without being focused first. Keys handled by a focused
 * element (via preventDefault) are not handled again here.
 */
export function useViewportKeys(
  ref: RefObject<HTMLElement | null>,
  handler: ViewportKeyHandler,
  enabled = true,
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const entry: Entry = { ref, handler: handlerRef };
    if (entries.size === 0) window.addEventListener("keydown", onKeyDown);
    entries.add(entry);
    return () => {
      entries.delete(entry);
      if (entries.size === 0) window.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, enabled]);
}
