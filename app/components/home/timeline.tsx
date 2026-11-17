import { experiences } from "~/_data/experience-data";
import { TimelineGraph } from "./timeline-graph";

// Same colours as the graph lanes (timeline-graph.tsx)
const LANES = [
  { label: "internships", rgb: "33, 219, 219" },
  { label: "volunteering", rgb: "255, 161, 173" },
];

// Desktop: the header stays pinned in a narrow left column while the graph
// scrolls on the right, so the section uses the full width of the page.
export function Timeline() {
  return (
    <section
      id="timeline"
      aria-labelledby="timeline-title"
      className="mx-auto grid max-w-7xl scroll-mt-16 grid-cols-1 gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-20 lg:px-8"
    >
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-muted-foreground font-mono text-sm">
          <span className="text-syntax-function">❯</span> git log --graph career
        </p>
        <h2
          id="timeline-title"
          className="text-foreground text-title mt-3 font-semibold tracking-tight"
        >
          Timeline
        </h2>
        <p className="text-syntax-comment mt-3 max-w-[65ch] text-sm md:text-base">
          {"// Where I've worked, newest first."}
        </p>
        <ul
          aria-label="Branch colours"
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-slate-400"
        >
          {LANES.map((lane) => (
            <li key={lane.label} className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2.5 rounded-[2px]"
                style={{
                  backgroundColor: `rgb(${lane.rgb})`,
                  boxShadow: `0 0 6px rgba(${lane.rgb}, 0.4)`,
                }}
              />
              {lane.label}
            </li>
          ))}
        </ul>
      </div>

      <TimelineGraph experiences={experiences} className="lg:pt-2" />
    </section>
  );
}
