import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { filters } from "~/_data/projects-data";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "~/lib/utils";

// Folder colours for the mobile filter tree (same family as the about sidebar)
const FOLDER_COLORS = [
  "text-red-400",
  "text-blue-400",
  "text-amber-400",
  "text-emerald-400",
];

type FilterSidebarProps = {
  activeFilters: string[];
  /** "screen" renders the bracket-checkbox list used in the mobile filter screen */
  variant?: "sidebar" | "screen";
};

export function FilterSidebar({
  activeFilters,
  variant = "sidebar",
}: FilterSidebarProps) {
  const getToggleUrl = (techId: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(techId)) {
      newFilters.delete(techId);
    } else {
      newFilters.add(techId);
    }
    const params = new URLSearchParams();
    if (newFilters.size > 0) {
      params.set("tech", Array.from(newFilters).join(","));
    }
    return `/projects?${params.toString()}`;
  };

  if (variant === "screen") {
    // Same `tree` look as the about page's file switcher (about-file-tree.tsx)
    return (
      <div className="font-mono">
        <p className="mb-2 text-base text-slate-500">~/filters</p>
        <ul aria-label="Filters" className="text-lg">
          {filters.map((group, g) => {
            const lastGroup = g === filters.length - 1;
            const childPrefix = lastGroup ? "    " : "│   ";
            return (
              <li key={group.name}>
                <p className="flex items-center whitespace-pre">
                  <span aria-hidden className="text-slate-600">
                    {lastGroup ? "└── " : "├── "}
                  </span>
                  <span
                    className={cn(
                      "py-1.5",
                      FOLDER_COLORS[g % FOLDER_COLORS.length],
                    )}
                  >
                    {group.name.toLowerCase().replace(/\s+/g, "-")}/
                  </span>
                </p>
                <ul>
                  {group.technologies.map((tech, t) => {
                    const isActive = activeFilters.includes(tech.id);
                    const lastTech = t === group.technologies.length - 1;
                    return (
                      <li
                        key={tech.id}
                        className="flex items-center whitespace-pre"
                      >
                        <span aria-hidden className="text-slate-600">
                          {childPrefix + (lastTech ? "└── " : "├── ")}
                        </span>
                        <Link
                          href={getToggleUrl(tech.id)}
                          replace
                          scroll={false}
                          aria-pressed={isActive}
                          className={cn(
                            "-mx-1 flex min-w-0 items-center gap-2 rounded-sm px-1 py-1.5 transition-colors focus-visible:bg-cyan-400/10 focus-visible:outline-none",
                            isActive
                              ? "text-cyan-300 [text-shadow:0_0_12px_rgba(56,189,248,0.5)]"
                              : "text-slate-300 active:text-cyan-300",
                          )}
                        >
                          <span
                            aria-hidden
                            className={
                              isActive ? "text-cyan-400" : "text-slate-600"
                            }
                          >
                            [{isActive ? "x" : " "}]
                          </span>
                          <i className={`${tech.icon} text-base`} aria-hidden />
                          <span className="truncate">{tech.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <aside className="h-screen p-4 font-mono text-sm">
      <h3 className="text-muted-foreground mb-2">
        <span className="text-primary">❯</span>{" "}
        <span className="text-syntax-function">cat</span>{" "}
        <span className="text-syntax-keyword">filters.yml</span>
      </h3>
      <ScrollArea className="h-[calc(100vh-3rem)] pr-2">
        <Accordion
          type="multiple"
          defaultValue={filters.map((f) => f.name)}
          className="w-full"
        >
          {filters.map((group) => (
            <AccordionItem
              key={group.name}
              value={group.name}
              className="border-border border-b"
            >
              <AccordionTrigger className="text-foreground py-2 hover:no-underline">
                {group.name}
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {group.technologies.map((tech) => {
                  const isActive = activeFilters.includes(tech.id);
                  return (
                    <Link
                      key={tech.id}
                      href={getToggleUrl(tech.id)}
                      className="hover:bg-border flex items-center gap-3 rounded-md px-2 py-1.5"
                    >
                      <Checkbox id={tech.id} checked={isActive} />
                      <label
                        htmlFor={tech.id}
                        className="text-muted-foreground flex w-full cursor-pointer items-center gap-2"
                      >
                        <i className={`${tech.icon} text-lg`} />
                        {tech.name}
                      </label>
                    </Link>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </aside>
  );
}
