import { AboutPageClient } from './about-page-client';

export function AboutPageLayout({
  sidebar,
  contentPanel,
  activeContentKey,
}: {
  sidebar: React.ReactNode;
  contentPanel: React.ReactNode;
  activeContentKey: string;
}) {
  return (
    <AboutPageClient
      sidebar={sidebar}
      contentPanel={contentPanel}
      activeContentKey={activeContentKey}
    />
  );
}