import Link from "next/link";
import { memo } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Gem, ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { BackgroundGradient } from "../ui/background-gradient";
import { LazyImage } from "../ui/lazy-image";

import type { ProjectType } from "~/models/project";

const DifficultyRating = memo(
  ({
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
      <div className="border-border bg-card/50 absolute right-2 bottom-2 flex items-center gap-1 rounded-full border px-2 py-1 backdrop-blur-sm">
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
  },
);
DifficultyRating.displayName = "DifficultyRating";

const CardContent = memo(({ project }: { project: ProjectType }) => {
  const isMaxDifficulty = Number(project.difficulty) === 5;

  return (
    <>
      <div className="relative aspect-[2.4/1] w-full overflow-hidden">
        <LazyImage
          src={project.imageUrl}
          alt={project.title}
          width={800}
          height={400}
          className="absolute top-1/2 left-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 transform transition-transform duration-300 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isMaxDifficulty
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100",
          )}
        >
          <DifficultyRating
            rank={Number(project.difficulty)}
            isMaxDifficulty={isMaxDifficulty}
          />
        </div>
      </div>
      <div className="flex flex-grow flex-col p-4">
        <p className="text-muted-foreground line-clamp-2 flex-grow text-sm">
          {project.shortDescription}
        </p>
        <div className="mt-4 flex gap-2 overflow-hidden">
          {project.tags.map((tag, index) => {
            // Show first 2 tags, then check if we need ellipsis
            if (index < 2) {
              return (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex-shrink-0 border-blue-500/50 font-normal text-blue-400"
                >
                  {tag}
                </Badge>
              );
            }
            // Show ellipsis if there are more tags
            if (index === 2 && project.tags.length > 2) {
              return (
                <Badge
                  key="ellipsis"
                  variant="outline"
                  className="flex-shrink-0 border-blue-500/50 font-normal text-blue-400"
                >
                  +{project.tags.length - 2}
                </Badge>
              );
            }
            return null;
          })}
        </div>
        <Button
          variant="ghost"
          className="text-accent hover:text-accent-foreground mt-4 w-fit p-0"
        >
          View Project <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
});
CardContent.displayName = "CardContent";

export const ProjectCard = memo(({ project }: { project: ProjectType }) => {
  const isMaxDifficulty = Number(project.difficulty) === 5;

  return (
    <div>
      <Link
        href={`/projects/${project.slug}`}
        className="group flex flex-col no-underline"
      >
        <div className="mb-2 font-mono text-sm">
          <span className="text-accent">{project.title}</span>
          <span className="text-muted-foreground ml-2">
            {"//"} {project.slug}
          </span>
        </div>

        {isMaxDifficulty ? (
          <BackgroundGradient
            containerClassName="rounded-lg h-full group"
            className="bg-accent-foreground flex h-full flex-col overflow-hidden rounded-lg"
          >
            <CardContent project={project} />
          </BackgroundGradient>
        ) : (
          <div className="border-border bg-accent-foreground group flex h-full flex-col overflow-hidden rounded-lg border">
            <CardContent project={project} />
          </div>
        )}
      </Link>
    </div>
  );
});
ProjectCard.displayName = "ProjectCard";
