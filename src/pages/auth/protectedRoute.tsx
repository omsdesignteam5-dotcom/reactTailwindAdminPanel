import React from "react";
import { Navigate } from "react-router-dom";

//components
import DefaultLayout from "src/layouts/defaultLayout";
import { getLocalStorageToken } from "src/services/localStorage";

export default function ProtectedRoute({ ...props }) {
  const token = getLocalStorageToken();
  const { languages } = props;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <DefaultLayout languages={languages} />;
}
