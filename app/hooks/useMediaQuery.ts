"use client";

import { useEffect, useState } from "react";

/**
 * Live result of a media query. `null` until mounted (the server can't know),
 * so callers can skip loading code for either side until the answer is in.
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}
