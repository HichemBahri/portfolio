"use client";

import { BookText, Layers } from "lucide-react";

export type ProjectTab = "README" | "TECH_STACK";

interface ProjectTabsProps {
  activeTab: ProjectTab;
  setActiveTab: (tab: ProjectTab) => void;
}

const TabButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      isActive
        ? "border-blue-500 text-white"
        : "border-transparent text-muted-foreground hover:text-white"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export function ProjectTabs({ activeTab, setActiveTab }: ProjectTabsProps) {
  return (
    <div className="bg-background sticky top-0 z-20 border-b border-gray-700">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <TabButton
            icon={<BookText size={16} />}
            label="README.md"
            isActive={activeTab === "README"}
            onClick={() => setActiveTab("README")}
          />
          <TabButton
            icon={<Layers size={16} />}
            label="Tech Stack"
            isActive={activeTab === "TECH_STACK"}
            onClick={() => setActiveTab("TECH_STACK")}
          />
        </div>
    </div>
  );
}