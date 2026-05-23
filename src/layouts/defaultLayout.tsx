import React from "react";

//Components
import Footer from "./footer";
import Content from "./content";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

//Provider
import { SidebarProvider } from "../context/sidebarContext";
import { TooltipProvider } from "../components/ui/tooltip/tooltip";

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
