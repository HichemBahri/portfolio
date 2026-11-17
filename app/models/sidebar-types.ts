export interface SidebarItem {
  title: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
}

export interface SidebarSubItem extends SidebarItem {
  items?: SidebarSubItem[];
}

export interface SidebarSection {
  value: string;
  title: string;
  isContact?: boolean;
  items: (SidebarSubItem | ContactItem)[];
}

export interface ContactItem {
  title: string;
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
