import { notFound } from "next/navigation";
import { projects } from "~/_data/projects-data";
import fs from "fs";
import path from "path";
import { ProjectPageClient } from "~/components/projects/project-page-client";

interface ProjectPageProps {
  params: Promise<{ slug?: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const markdownPath = path.join(
    process.cwd(),
    "app/_data/content",
    project.markdownFilename,
  );
  let markdownContent = "";
  try {
    markdownContent = fs.readFileSync(markdownPath, "utf-8");
  } catch {
    markdownContent = "### About Project\n\nProject description not found.";
  }

  return (
    <div className="h-[calc(100vh-48px)] pt-11">
      <ProjectPageClient project={project} markdownContent={markdownContent} />
    </div>
  );
}
