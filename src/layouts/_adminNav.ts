//icons
import { LayoutDashboard, Settings, Users } from "lucide-react";

//components
import type { SidebarData } from "./sidebarTypes";

export const adminNav: SidebarData = {
  navItems: [
    {
      component: "item",
      title: "Dashboard",
      name: "dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      component: "item",
      title: "Sample Users",
      name: "sampleUsers",
      url: "/sample-users",
      icon: Users,
    },
    {
      component: "item",
      title: "Settings",
      name: "settings",
      url: "/setting",
      icon: Settings,
      // _children: [
      //   {
      //     component: "item",
      //     title: "School Settings",
      //     name: "schoolSettings",
      //     url: "/setting",
      //     icon: Settings,
      //   },
      // ],
    },
  ],
};
