import React from "react";

const Dashboard = React.lazy(() => import("../pages/dashboard/dashboard"));
const Setting = React.lazy(() => import("../pages/setting/setting"));

type AppRoute = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
};

const publicRoute: AppRoute[] = [
  { path: "/dashboard", component: Dashboard },
  { path: "/setting", component: Setting },
];

export default publicRoute;
