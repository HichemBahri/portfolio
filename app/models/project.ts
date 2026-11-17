export interface Technology {
  name: string;
  icon: string; // devicon class name
  version?: string;
  description: string;
}

export interface ProjectType {
  id: number;
  title: string;
  slug: string;
  imageUrl: string;
  backgroundImage: string;
  logo: string;
  shortDescription: string;
  longDescription: string;
  projectUrl: string;
  difficulty: string;
  color: string;
  tags: string[];
  markdownFilename: string;
  technologies: Technology[];
  liveUrl: string;
  repoUrl: string;
  gallery: string[];
  technicalDetails: { label: string; value: string }[];
  codeSnippet?: string;
  blurhash?: string;
}
