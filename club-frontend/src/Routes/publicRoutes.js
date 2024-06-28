import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Signup from "../Pages/Public/Auth/Signup";

const PublicRoutes = ({setToken, setUser}) => {
  return (
    <Routes>
      <Route path="/signin" element={<Signup setToken={setToken} setUser={setUser} />} />
      <Route
        path="*"
        element={<Navigate to="/signin" replace />}
    />
    </Routes>
  );
};

export default PublicRoutes;
