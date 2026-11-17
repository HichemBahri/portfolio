"use client";

import { useState, lazy, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Github,
  ChevronLeft,
  ChevronRight,
  Play,
  Terminal,
  Lock,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { ProjectType } from "~/models/project";
import { ProjectTabs, type ProjectTab } from "./project-tabs";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Boxes } from "~/components/ui/background-boxes";
import { LazyImage } from "~/components/ui/lazy-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Gem } from "lucide-react";
import { cn } from "~/lib/utils";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";

const ReadmeView = lazy(() =>
  import("./project-views").then((module) => ({ default: module.ReadmeView })),
);
const TechStackView = lazy(() =>
  import("./project-views").then((module) => ({
    default: module.TechStackView,
  })),
);

// --- View Components ---

const DifficultyRating = ({
  rank,
  isMaxDifficulty = false,
}: {
  rank: number;
  isMaxDifficulty?: boolean;
}) => {
  const totalIcons = 5;
  const getColor = (index: number, rank: number) => {
    if (index >= rank) return "text-muted-foreground/30";
    if (rank <= 2) return "text-green-400";
    if (rank <= 4) return "text-yellow-400";
    return "text-purple-400";
  };
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: totalIcons }).map((_, index) => (
        <Gem
          key={index}
          className={cn(
            "h-3 w-3 transition-colors",
            getColor(index, rank),
            isMaxDifficulty && index < rank && "animate-pulse",
          )}
          fill={index < rank ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
};

// --- Main Component ---

interface ProjectPageClientProps {
  project: ProjectType;
  markdownContent: string;
}

export function ProjectPageClient({
  project,
  markdownContent,
}: ProjectPageClientProps) {
  const [activeTab, setActiveTab] = useState<ProjectTab>("README");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openModal = (index: number) => setSelectedIndex(index);
  const closeModal = () => setSelectedIndex(null);

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < project.gallery!.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goToPrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <ScrollArea className="h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-full text-white"
      >
        {/* Header Section */}
        <header className="relative overflow-hidden border-b border-gray-700 pt-8 pb-12">
          <Boxes className="opacity-20" />
          <div className="pointer-events-none relative z-10 container mx-auto px-4">
            {/* Back Link */}
            <div className="pointer-events-auto mb-8">
              <Link
                href="/projects"
                className="text-sm transition-colors hover:text-white"
              >
                <span className="font-mono">
                  <span className="text-primary">❯</span>{" "}
                  <span className="text-syntax-function">cd</span>{" "}
                  <span className="text-syntax-keyword">../</span>
                </span>
              </Link>
            </div>

            {/* Header Content */}
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                {project.logo && (
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg">
                    <LazyImage
                      src={project.logo}
                      alt={`${project.title} logo`}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                      priority={true}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold tracking-tighter md:text-4xl">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground/70 text-xs">
                      Difficulty:
                    </span>
                    <DifficultyRating
                      rank={Number(project.difficulty)}
                      isMaxDifficulty={Number(project.difficulty) === 5}
                    />
                  </div>
                </div>
              </div>
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge
                      key={`${tag}-${index}`}
                      className="rounded-none border border-[var(--sh-keyword)] bg-slate-800/50 px-2 py-0.5 text-[var(--sh-keyword)]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="max-w-3xl">
              <p className="text-muted-foreground mb-4 text-sm md:text-base">
                {project.shortDescription}
              </p>
            </div>

            <div className="pointer-events-auto mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 pb-5 md:pb-3">
                {project.repoUrl ? (
                  <Button asChild>
                    <Link href={project.repoUrl} target="_blank">
                      <Github className="mr-2 h-4 w-4" />
                      <span className="font-mono">git --clone</span>
                    </Link>
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    <Lock className="mr-2 h-4 w-4" />
                    <span className="font-mono">repo --private</span>
                  </Button>
                )}

                {project.liveUrl ? (
                  <Button
                    asChild
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Link href={project.liveUrl} target="_blank">
                      <Play className="mr-2 h-4 w-4" />
                      <span className="font-mono">live --demo</span>
                    </Link>
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>
                    <Terminal className="mr-2 h-4 w-4" />
                    <span className="font-mono">no --live-demo</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Gallery Thumbs */}
            {project.gallery && project.gallery.length > 0 && (
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="pointer-events-auto w-full"
              >
                <CarouselContent>
                  {project.gallery.map((imageUrl, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-1/3 cursor-pointer md:basis-1/4 lg:basis-1/5"
                      onClick={() => openModal(index)}
                    >
                      <div className="h-32 flex-shrink-0 overflow-hidden rounded-lg border-2 border-transparent transition-colors hover:border-blue-500">
                        <LazyImage
                          src={imageUrl}
                          alt={`${project.title} gallery image ${index + 1}`}
                          width={640}
                          height={360}
                          className="h-full w-full object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        </header>

        {/* Tabs */}
        <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <div className="container mx-auto px-4">
          {/* Content */}
          <main>
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              {activeTab === "README" && (
                <ReadmeView markdownContent={markdownContent} />
              )}
              {activeTab === "TECH_STACK" && (
                <TechStackView project={project} />
              )}
            </Suspense>
          </main>
        </div>

        {/* Modal */}
        {selectedIndex !== null && (
          <Dialog
            open={true}
            onOpenChange={(isOpen) => !isOpen && closeModal()}
          >
            <DialogContent className="!w-[90vw] !max-w-[90vw] border-0 bg-transparent p-0 shadow-none">
              <DialogTitle className="sr-only">Project Asset</DialogTitle>

              {/* Center the image */}
              <div className="relative flex items-center justify-center">
                {project.gallery && project.gallery[selectedIndex!] && (
                  <LazyImage
                    src={project.gallery[selectedIndex!] as string}
                    alt={`${project.title} gallery image ${selectedIndex + 1}`}
                    width={1920}
                    height={1080}
                    className="h-auto max-h-[85vh] w-auto max-w-full object-contain"
                    priority={true}
                    sizes="90vw"
                  />
                )}

                {/* Prev button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrev}
                  disabled={selectedIndex === 0}
                  className="absolute top-1/2 left-2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/75"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                {/* Next button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNext}
                  disabled={selectedIndex === project.gallery!.length - 1}
                  className="absolute top-1/2 right-2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/75"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </ScrollArea>
  );
}
