"use client";
import dynamic from "next/dynamic";
import { HeroTextAnimation } from "./hero/hero-text-animation";
// import { useLoading } from "./LoadingProvider";
const SnakeGame = dynamic(
  () => import("./snake-game").then((m) => m.SnakeGame),
  {
    ssr: false,
    loading: () => null,
  },
);
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
// Mobile-only canvas art; reserves its box so nothing shifts when it loads
const SynthwaveScene = dynamic(
  () => import("./hero/synthwave-scene").then((m) => m.SynthwaveScene),
  { ssr: false, loading: () => <div className="aspect-[5/4] w-full" /> },
);
import { ScrollPager } from "./home/scroll-pager";
import { useSplashVisible } from "./SplashScreenProvider";
import { useMediaQuery } from "~/hooks/useMediaQuery";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Mobile: the scene (80vw tall, 5:4) bleeds to the screen edges and pins
// mid-screen while the text scrolls away; the extra 50svh is how long it
// stays before the projects section pushes it up. Sticky, so the browser pins
// it without JS. The sun sets over that stretch and rises again on the way
// back. -mb clips the bottom of the scene, which the mask already fades out,
// so the next section follows right after the horizon.
const RUNWAY =
  "-mx-4 mt-10 -mb-[12vw] h-[calc(80vw_+_50svh)] sm:-mx-6 md:hidden";

// Fully set a little before the pin releases
const sunsetAt = (
  y: number,
  { start, span }: { start: number; span: number },
) => Math.min(1, Math.max(0, (y - start) / (span * 0.85)));

function PinnedSynthwave() {
  const runwayRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  // Page scroll range over which the scene is pinned
  const range = useRef({ start: 0, span: 1 });
  const { scrollY } = useScroll();
  const sunset = useTransform(scrollY, (y) => sunsetAt(y, range.current));

  useEffect(() => {
    const runway = runwayRef.current;
    const pin = pinRef.current;
    if (!runway || !pin) return;
    const measure = () => {
      const top = parseFloat(getComputedStyle(pin).top) || 0;
      const runwayTop = runway.getBoundingClientRect().top + window.scrollY;
      range.current = {
        start: runwayTop - top,
        span: Math.max(1, runway.offsetHeight - pin.offsetHeight),
      };
      // Nothing scrolled, but the range moved
      sunset.set(sunsetAt(scrollY.get(), range.current));
    };
    measure();
    // The typed intro above changes height, which moves the runway
    const ro = new ResizeObserver(measure);
    if (runway.parentElement) ro.observe(runway.parentElement);
    ro.observe(pin);
    return () => ro.disconnect();
  }, [scrollY, sunset]);

  return (
    <div ref={runwayRef} className={RUNWAY}>
      <div
        ref={pinRef}
        className="sticky top-[max(3.5rem,calc((100svh_-_80vw)/2))]"
      >
        <SynthwaveScene sunset={sunset} />
      </div>
    </div>
  );
}

export function Hero() {
  // Hold the typing intro until the splash (if any) is gone
  const splashVisible = useSplashVisible();
  // Only download and run the art for the current layout: the snake game on
  // desktop, the synthwave canvas on mobile (null until known)
  const isDesktop = useMediaQuery("(min-width: 768px)");
  // overflow-clip, not hidden: hidden turns the section into a scroll
  // container and the mobile scene's sticky stops working (iOS < 16 keeps
  // hidden, so the scene just scrolls normally there)
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="pointer-events-none relative min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-screen grid-cols-1 items-center gap-y-10 pt-20 md:grid-cols-2 md:gap-x-16 md:py-24">
          {/* Left Column: Text Content */}
          <motion.div
            variants={stagger}
            className="pointer-events-none z-10 flex flex-col justify-center text-left"
          >
            <HeroTextAnimation isLoading={splashVisible} />
            {/* Mobile: synthwave horizon (the snake console is desktop only) */}
            {isDesktop === false ? (
              <PinnedSynthwave />
            ) : (
              <div className={RUNWAY} />
            )}
          </motion.div>

          {/* Right Column: Snake Game (visible on medium screens and up) */}
          <motion.div
            variants={fadeInUp}
            className="pointer-events-auto hidden items-center justify-center md:flex"
          >
            {isDesktop && <SnakeGame />}
          </motion.div>
        </div>
      </div>
      <ScrollPager targetId="leaderboard" />
    </motion.section>
  );
}
