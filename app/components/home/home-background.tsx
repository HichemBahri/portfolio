"use client";
import dynamic from "next/dynamic";
import { Boxes } from "~/components/ui/background-boxes";
import { useMediaQuery } from "~/hooks/useMediaQuery";

const HeroBlobs = dynamic(
  () => import("~/components/hero/hero-blobs").then((m) => m.HeroBlobs),
  { ssr: false },
);

// Pinned to the viewport so the hero backdrop stays put while the page scrolls over it.
// Own compositor layer, so repaints elsewhere on the page never re-raster the grid.
export function HomeBackground() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden will-change-transform"
    >
      <Boxes className="opacity-15" trackWindow />
      {/* Desktop only; not even downloaded on phones */}
      {isDesktop && <HeroBlobs />}
    </div>
  );
}
