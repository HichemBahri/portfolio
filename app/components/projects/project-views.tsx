'use client';

import { lazy, Suspense } from 'react';
import type { ProjectType } from '~/models/project';
import { Skeleton } from '~/components/ui/skeleton';

const ProjectShowcase = lazy(() =>
  import('~/components/projects/project-showcase').then((module) => ({ default: module.ProjectShowcase }))
);

export const ReadmeView = ({ markdownContent }: { markdownContent: string }) => (
  <div className="px-2 py-4 pb-12 md:px-4 md:py-8 md:pb-16">
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ProjectShowcase markdownContent={markdownContent} />
    </Suspense>
  </div>
);

export const TechStackView = ({ project }: { project: ProjectType }) => (
  <div className="py-8 pb-16">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {project.technologies.map((tech) => (
        <div
          key={tech.name}
          className="group rounded-lg border border-gray-700 bg-gray-800/50 p-6 transition-all duration-200 hover:border-gray-500 hover:bg-gray-800/70"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <i
                className={`${tech.icon} text-2xl text-gray-300 transition-colors group-hover:text-white`}
              ></i>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {tech.name}
                </h3>
                {tech.version && (
                  <span className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300">
                    v{tech.version}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                {tech.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);