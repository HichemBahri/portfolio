"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { BracketButton, ScreenDialog } from "~/components/ui/screen-dialog";

export function ProjectsPageClientLayout({
  filterSidebar,
  filterScreen,
  filterBar,
  mobileFilterChips,
  projectGrid,
  activeFilterCount,
  resultCount,
  totalCount,
}: {
  filterSidebar: React.ReactNode;
  /** Filter list styled for the full-screen mobile dialog */
  filterScreen: React.ReactNode;
  filterBar: React.ReactNode;
  /** Mobile: removable chips for the active filters (null when none) */
  mobileFilterChips: React.ReactNode;
  projectGrid: React.ReactNode;
  activeFilterCount: number;
  resultCount: number;
  totalCount: number;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden h-full md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            {filterSidebar}
          </ResizablePanel>
          <ResizableHandle className="bg-border" />
          <ResizablePanel defaultSize={80}>
            <div className="flex h-full flex-col">
              {filterBar}
              {projectGrid}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* --- MOBILE LAYOUT --- */}
      <div className="block h-full md:hidden">
        <div className="flex h-full flex-col">
          <div className="border-border border-b">
            <div className="flex items-center justify-between gap-2 py-1 pr-2 pl-4">
              <p className="min-w-0 truncate font-mono text-sm">
                <span className="text-primary">❯</span>{" "}
                <span className="text-syntax-function">ls</span>{" "}
                <span className="text-syntax-keyword">./projects</span>{" "}
                <span className="text-slate-500">
                  {activeFilterCount > 0
                    ? `// ${resultCount} of ${totalCount}`
                    : `// ${totalCount}`}
                </span>
              </p>
              <ScreenDialog
                open={filtersOpen}
                onOpenChange={setFiltersOpen}
                title="filter projects"
                hint="tap to toggle, results update live"
                trigger={
                  <BracketButton className="shrink-0">
                    {activeFilterCount > 0
                      ? `filters (${activeFilterCount}) ▾`
                      : "filters ▾"}
                  </BracketButton>
                }
              >
                {filterScreen}

                <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-cyan-400/20 pt-6 pb-2">
                  {activeFilterCount > 0 ? (
                    <Link
                      href="/projects"
                      replace
                      scroll={false}
                      className="rounded-sm px-2 py-2 font-mono text-sm text-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
                    >
                      [ clear all ]
                    </Link>
                  ) : (
                    <span />
                  )}
                  <BracketButton
                    onClick={() => setFiltersOpen(false)}
                    className="border-2 border-cyan-400/40 px-4 py-2.5 shadow-[4px_4px_0_0_rgba(33,219,219,0.18)]"
                  >
                    {`show ${resultCount} project${resultCount === 1 ? "" : "s"}`}
                  </BracketButton>
                </div>
              </ScreenDialog>
            </div>
            {mobileFilterChips}
          </div>
          {projectGrid}
        </div>
      </div>
    </>
  );
}
