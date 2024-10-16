// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    // Si no hay un token, redirigimos al login
    return <Navigate to="/" replace />;
  }

  // Si hay token, renderizamos la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;
