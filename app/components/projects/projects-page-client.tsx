"use client";

import { ProjectCard } from "~/components/projects/project-card";
import type { ProjectType } from "~/models/project";
import { ScrollArea } from "~/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectsPageClientProps {
  projects: ProjectType[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  return (
    <ScrollArea className="h-full flex-grow">
      <div className="h-full p-4 pb-8 md:p-8">
        <AnimatePresence>
          <motion.div
            className="max-w-8xl mx-auto grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        {projects.length === 0 && (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <p>No projects found with the selected filters.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}