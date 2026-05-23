//icons
import { LayoutDashboard, Settings } from "lucide-react";

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
      component: "group",
      title: "Settings",
      name: "settings",
      route: "/setting",
      icon: Settings,
      _children: [
        {
          component: "item",
          title: "School Settings",
          name: "schoolSettings",
          url: "/setting",
          icon: Settings,
        },
      ],
    },
  ],
};
