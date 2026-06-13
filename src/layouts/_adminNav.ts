// icons
import { LayoutDashboard, Settings, Users, Map } from "lucide-react";

// components
import type { SidebarData } from "src/layouts/sidebarTypes";

export const adminNav: SidebarData = {
  navItems: [
    {
      component: "item",
      name: "dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      component: "item",
      name: "sampleUsers",
      url: "/sampleUsers",
      icon: Users,
    },
    {
      component: "item",
      name: "sampleMap",
      url: "/sampleMap",
      icon: Map,
    },
    {
      component: "group",
      name: "setting",
      url: "/setting",
      icon: Settings,
      _children: [
        {
          component: "item",
          name: "users",
          url: "/setting/users",
          icon: Users,
        },
      ],
    },
  ],
};
