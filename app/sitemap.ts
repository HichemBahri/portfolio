import { projects } from "./_data/projects-data";

export const baseUrl = "https://hichem-bahri-portfolio.vercel.app";

export default async function sitemap() {
  const routes = ["", "/blog", "/projects"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...projectRoutes];
}
