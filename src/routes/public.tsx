import React from "react";

const Dashboard = React.lazy(() => import("../pages/dashboard/dashboard"));
const Setting = React.lazy(() => import("../pages/setting/setting"));
const SampleUsers = React.lazy(() => import("../pages/sample-users/sampleUsers"));

type AppRoute = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
};

const publicRoute: AppRoute[] = [
  { path: "/dashboard", component: Dashboard },
  { path: "/setting", component: Setting },
  { path: "/sample-users", component: SampleUsers },
];

export default publicRoute;
