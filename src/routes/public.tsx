import React from "react";

const Dashboard = React.lazy(() => import("../pages/dashboard/dashboard"));
const Setting = React.lazy(() => import("../pages/setting/setting"));
const SampleUsers = React.lazy(
  () => import("../pages/sample-users/sampleUsers"),
);

//Auth Users
const Profile = React.lazy(() => import("../pages/auth/profile"));

//Users
const UsersList = React.lazy(() => import("../pages/users/usersList"));
const UserForm = React.lazy(() => import("../pages/users/userForm"));

//Map Sample
const MapSample = React.lazy(() => import("../pages/sample-users/sampleMap"));

type AppRoute = {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
};

const publicRoute: AppRoute[] = [
  { path: "/dashboard", component: Dashboard },
  { path: "/setting", component: Setting },
  { path: "/profile", component: Profile },
  { path: "/sampleUsers", component: SampleUsers },
  { path: "/sampleMap", component: MapSample },
  { path: "/setting/users", component: UsersList },
  { path: "/setting/userForm/:id", component: UserForm },
];

export default publicRoute;
