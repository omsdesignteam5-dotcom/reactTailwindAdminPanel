import React from "react";
import { Navigate, useLocation } from "react-router-dom";

//components
import DefaultLayout from "../../layouts/defaultLayout";

export default function ProtectedRoute({ ...props }) {
  const currentLocation = useLocation().pathname;
  let { languages, basicInfo } = props;
  console.log(languages, "languages in protected route");

  // Redirect to login if on login page, else to landing page
  if (currentLocation.includes("login")) {
    return <Navigate to="/login" replace={true} />;
  }

  return <DefaultLayout languages={languages} />;
}
