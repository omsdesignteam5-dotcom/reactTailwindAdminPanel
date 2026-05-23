import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

//routes
import routes from "../routes/public";

export default function Content() {
  return (
    <div className="w-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map((route, idx) => {
            if (!route.component) return null;
            const Component = route.component;
            return (
              <Route key={idx} path={route.path} element={<Component />} />
            );
          })}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
