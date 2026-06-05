import React from "react";

//Components
import Footer from "src/layouts/footer";
import Content from "src/layouts/content";
import { Header } from "src/layouts/header";
import { Sidebar } from "src/layouts/sidebar";

//Provider
import { SidebarProvider } from "src/context/sidebarContext";
import { TooltipProvider } from "src/components/ui/tooltip/tooltip";

export default function DefaultLayout({ ...props }) {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={0}>
        <div className="flex min-h-svh w-full bg-background text-foreground">
          <Sidebar />
          <div className="flex flex-1 flex-col min-w-0">
            <Header languages={props.languages} title="SMS" />
            <main className="flex-1 bg-background p-4">
              <Content />
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
