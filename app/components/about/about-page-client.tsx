"use client";

import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { BracketButton, ScreenDialog } from "~/components/ui/screen-dialog";
import { AboutFileTree } from "./about-file-tree";
import dynamic from "next/dynamic";
const Terminal = dynamic(
  () => import("~/components/terminal/terminal").then((m) => m.Terminal),
  { ssr: false },
);
import { FileCode } from "lucide-react";
import { TabBar, type Tab } from "./tab-bar";
import { sidebarSections } from "~/_data/about-data";
import { useRouter } from "next/navigation";

const allSidebarItems = sidebarSections.flatMap((section) =>
  section.items.flatMap((item) =>
    item.items ? [item, ...item.items] : [item],
  ),
);

export function AboutPageClient({
  sidebar,
  contentPanel,
  activeContentKey,
}: {
  sidebar: React.ReactNode;
  contentPanel: React.ReactNode;
  activeContentKey: string;
}) {
  const router = useRouter();
  const isClosingTab = useRef(false);
  const [isTerminalMinimized, setIsTerminalMinimized] = useLocalStorage(
    "terminalMinimized",
    false,
  );
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const activeFileName = activeContentKey.split("/").pop() ?? activeContentKey;

  const [openTabs, setOpenTabs] = useLocalStorage<Tab[]>("openAboutTabs", [
    { key: "bio", name: "bio", icon: FileCode, color: "text-red-400" },
  ]);

  useEffect(() => {
    if (isClosingTab.current) {
      isClosingTab.current = false;
      return;
    }

    const currentItem = allSidebarItems.find(
      (item) => item.path.replace("/about/", "") === activeContentKey,
    );
    const tabExists = openTabs.some((tab) => tab.key === activeContentKey);

    if (currentItem && !tabExists) {
      setOpenTabs([
        ...openTabs,
        {
          key: activeContentKey,
          name: currentItem.title,
          icon: currentItem.icon,
          color: currentItem.color,
        },
      ]);
    }
  }, [activeContentKey, openTabs, setOpenTabs]);

  const handleToggleTerminal = () =>
    setIsTerminalMinimized(!isTerminalMinimized);

  const closeTab = (tabToClose: Tab, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (activeContentKey === tabToClose.key) {
      isClosingTab.current = true;
    }

    const index = openTabs.findIndex((tab) => tab.key === tabToClose.key);
    const newTabs = openTabs.filter((tab) => tab.key !== tabToClose.key);

    if (activeContentKey === tabToClose.key) {
      if (newTabs.length === 0) {
        router.push("/about");
      } else {
        const newActiveIndex =
          index >= newTabs.length ? newTabs.length - 1 : index;
        const newActiveTab = newTabs[newActiveIndex];
        if (newActiveTab) {
          router.push(`/about/${newActiveTab.key}`);
        }
      }
    }

    setOpenTabs(newTabs);
  };

  return (
    <>
      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden h-full md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={20} minSize={20} maxSize={30}>
            {sidebar}
          </ResizablePanel>
          <ResizableHandle className="bg-border" />
          <ResizablePanel defaultSize={80}>
            <div className="flex h-full flex-col">
              <TabBar
                openTabs={openTabs}
                activeContentKey={activeContentKey}
                closeTab={closeTab}
              />
              <div className="flex flex-grow flex-col">
                <div className="flex-grow">
                  {isTerminalMinimized ? (
                    contentPanel
                  ) : (
                    <ResizablePanelGroup direction="vertical">
                      <ResizablePanel defaultSize={55} minSize={20}>
                        {contentPanel}
                      </ResizablePanel>
                      <ResizableHandle withHandle className="bg-border" />
                      <ResizablePanel defaultSize={45} minSize={20}>
                        <Terminal
                          isMinimized={false}
                          onToggleMinimize={handleToggleTerminal}
                        />
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
                {isTerminalMinimized && (
                  <div className="h-10 shrink-0">
                    <Terminal
                      isMinimized={true}
                      onToggleMinimize={handleToggleTerminal}
                    />
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* --- MOBILE LAYOUT --- */}
      <div className="block h-full md:hidden">
        <div className="flex h-full flex-col">
          {/* Current file + one clearly labelled way to switch */}
          <div className="border-border flex items-center justify-between gap-3 border-b px-4 py-3">
            <p className="min-w-0 truncate font-mono text-lg text-slate-100">
              {activeFileName}
              <span className="text-slate-500">.ts</span>
            </p>
            <ScreenDialog
              open={fileDialogOpen}
              onOpenChange={setFileDialogOpen}
              title="which file?"
              hint="tap a file to open it"
              trigger={
                <BracketButton className="shrink-0">
                  switch file ▾
                </BracketButton>
              }
            >
              <AboutFileTree
                activeContentKey={activeContentKey}
                onNavigate={() => setFileDialogOpen(false)}
              />
            </ScreenDialog>
          </div>

          <div className="flex-grow overflow-y-auto p-4 pb-24">
            {contentPanel}
          </div>

          {/* The AI terminal opens full-screen from a floating button */}
          <ScreenDialog
            open={terminalOpen}
            onOpenChange={setTerminalOpen}
            title="ask me anything"
            hint="an AI that knows my work"
            bodyClassName="mt-6"
            trigger={
              <BracketButton className="fixed right-4 bottom-16 z-40 border-2 border-cyan-400/40 bg-[#101822] px-4 py-2.5 shadow-[4px_4px_0_0_rgba(33,219,219,0.18)]">
                ask ai
              </BracketButton>
            }
          >
            <div className="min-h-0 flex-1">
              <Terminal
                isMinimized={false}
                onToggleMinimize={() => setTerminalOpen(false)}
              />
            </div>
          </ScreenDialog>
        </div>
      </div>
    </>
  );
}
