"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "~/lib/utils";
import { LazyImage } from "~/components/ui/lazy-image";

const SNAKE_RGB = "33, 219, 219";

interface LeaderboardCarouselProps {
  images: string[];
  title: string;
  index: number;
  direction: 1 | -1;
  onChange: (index: number, direction: 1 | -1) => void;
}

function SmallKey({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs font-bold text-slate-800 transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none active:translate-y-px"
    >
      {children}
    </button>
  );
}

// A small in-console screen that flips through a project's screenshots
export function LeaderboardCarousel({
  images,
  title,
  index,
  direction,
  onChange,
}: LeaderboardCarouselProps) {
  const reduce = useReducedMotion();
  const count = images.length;
  const go = (step: 1 | -1) => onChange((index + step + count) % count, step);
  const src = images[index];

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[16/9] overflow-hidden rounded-md border border-cyan-400/20 bg-black shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]"
        aria-roledescription="carousel"
        aria-label={`${title} screenshots`}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {src && (
            <motion.div
              key={src}
              custom={direction}
              initial={reduce ? false : { opacity: 0, x: `${direction * 12}%` }}
              animate={{ opacity: 1, x: 0 }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: `${direction * -12}%` }
              }
              transition={{
                duration: reduce ? 0 : 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-0"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              {/* Fixed 16:9 screen; the image keeps its own ratio and the rest stays black */}
              {/* Same ASCII donut loader as the project pages, scaled to
                  fit the small screen */}
              <LazyImage
                src={src}
                alt={`${title} screenshot ${index + 1}`}
                fill
                sizes="(max-width: 768px) calc(100vw - 4rem), 560px"
                className="object-contain object-center"
                loaderClassName="scale-50 md:scale-75"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_3px)]"
        />
      </div>

      {count > 1 && (
        <div className="flex items-center gap-3">
          <SmallKey label="Previous screenshot" onClick={() => go(-1)}>
            h
          </SmallKey>
          <div className="flex flex-1 items-center gap-[3px]">
            {images.map((image, i) => (
              <button
                key={image}
                type="button"
                aria-label={`Show screenshot ${i + 1}`}
                aria-current={i === index}
                onClick={() => onChange(i, i > index ? 1 : -1)}
                className="group flex h-4 items-center focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "block size-2.5 rounded-[2px] transition-all group-focus-visible:ring-2 group-focus-visible:ring-cyan-300",
                    i !== index &&
                      "border border-slate-600/60 group-hover:border-cyan-400/60",
                  )}
                  style={
                    i === index
                      ? {
                          backgroundColor: `rgb(${SNAKE_RGB})`,
                          boxShadow: `0 0 10px rgba(${SNAKE_RGB}, 0.7)`,
                        }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-cyan-400/80 tabular-nums">
            {index + 1}/{count}
          </span>
          <SmallKey label="Next screenshot" onClick={() => go(1)}>
            l
          </SmallKey>
        </div>
      )}
    </div>
  );
}
