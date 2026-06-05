// icons
import { LayoutDashboard, Settings, Users } from "lucide-react";

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
      url: "/sample-users",
      icon: Users,
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
