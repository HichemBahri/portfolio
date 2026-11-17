import Link from "next/link";
import { FilterSidebar } from "~/components/projects/filter-sidebar";
import { projects, filters } from "~/_data/projects-data";
import { X } from "lucide-react";
import { ProjectsPageLayout } from "~/components/projects/project-page-layout";
import { ProjectsPageClient } from "~/components/projects/projects-page-client";

type ProjectsPageProps = {
  searchParams: Promise<{
    tech?: string;
  }>;
};

const FilterBar = ({ activeFilters }: { activeFilters: string[] }) => {
  const getFilterName = (id: string) =>
    filters.flatMap((g) => g.technologies).find((t) => t.id === id)?.name ?? id;

  const getToggleUrl = (techId: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(techId)) {
      newFilters.delete(techId);
    }
    const params = new URLSearchParams();
    if (newFilters.size > 0) {
      params.set("tech", Array.from(newFilters).join(","));
    }
    return `/projects?${params.toString()}`;
  };

  return (
    <div className="border-border flex flex-wrap items-center gap-4 p-4 text-sm">
      {activeFilters.length > 0 ? (
        <>
          <div className="flex flex-wrap items-center gap-x-2 font-mono">
            <span>
              <span className="text-primary">❯</span>{" "}
              <span className="text-syntax-function">ls</span>{" "}
              <span className="text-syntax-keyword">./projects</span>
            </span>
            {activeFilters.map((filterId) => (
              <span key={filterId} className="flex items-center gap-x-2">
                <span className="text-syntax-punctuation">|</span>{" "}
                <span className="text-syntax-function">grep</span>{" "}
                <span className="text-syntax-keyword">
                  &quot;{getFilterName(filterId)}&quot;
                </span>
                <Link
                  href={getToggleUrl(filterId)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </Link>
              </span>
            ))}
          </div>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground ml-auto font-mono"
          >
            ^C
          </Link>
        </>
      ) : (
        <span className="font-mono">
          <span className="text-primary">❯</span>{" "}
          <span className="text-syntax-function">ls</span>{" "}
          <span className="text-syntax-keyword">./projects</span>
        </span>
      )}
    </div>
  );
};

// Mobile: active filters as one scrollable row of removable chips
const MobileFilterChips = ({ activeFilters }: { activeFilters: string[] }) => {
  if (activeFilters.length === 0) return null;
  const allTech = filters.flatMap((g) => g.technologies);
  const nameOf = (id: string) => allTech.find((t) => t.id === id)?.name ?? id;
  const without = (id: string) => {
    const rest = activeFilters.filter((f) => f !== id);
    return rest.length ? `/projects?tech=${rest.join(",")}` : "/projects";
  };

  return (
    <ul
      aria-label="Active filters"
      className="flex gap-2 overflow-x-auto px-4 pb-3 font-mono text-sm whitespace-nowrap [scrollbar-width:none]"
    >
      {activeFilters.map((id) => (
        <li key={id}>
          <Link
            href={without(id)}
            replace
            scroll={false}
            aria-label={`Remove ${nameOf(id)} filter`}
            className="flex items-baseline gap-1 rounded-sm border border-cyan-400/30 bg-cyan-400/[0.06] px-2 py-1 text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none active:translate-y-px"
          >
            <span aria-hidden className="text-cyan-400">
              [
            </span>
            {nameOf(id)}
            <span aria-hidden className="text-slate-400">
              ✕
            </span>
            <span aria-hidden className="text-cyan-400">
              ]
            </span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/projects"
          replace
          scroll={false}
          className="flex items-baseline rounded-sm px-2 py-1 text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
        >
          [ clear ]
        </Link>
      </li>
    </ul>
  );
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const activeFilters = params.tech ? params.tech.split(",") : [];

  const filteredProjects =
    activeFilters.length === 0
      ? projects
      : projects.filter((project) =>
          activeFilters.some((filter) =>
            project.technologies.some(
              (tech) => tech.name.toLowerCase() === filter,
            ),
          ),
        );

  return (
    <div className="h-[calc(100vh-48px)] pt-11">
      <ProjectsPageLayout
        filterSidebar={<FilterSidebar activeFilters={activeFilters} />}
        filterScreen={
          <FilterSidebar activeFilters={activeFilters} variant="screen" />
        }
        filterBar={<FilterBar activeFilters={activeFilters} />}
        projectGrid={<ProjectsPageClient projects={filteredProjects} />}
        mobileFilterChips={<MobileFilterChips activeFilters={activeFilters} />}
        activeFilterCount={activeFilters.length}
        resultCount={filteredProjects.length}
        totalCount={projects.length}
      />
    </div>
  );
}
