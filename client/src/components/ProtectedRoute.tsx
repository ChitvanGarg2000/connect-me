// ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../utils/getCookie";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = getCookie("user_token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
