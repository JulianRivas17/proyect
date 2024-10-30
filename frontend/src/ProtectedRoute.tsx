// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  group?: string;
}

const ProtectedRoute: React.FC<{ requiredGroup?: string }> = ({ requiredGroup }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded: DecodedToken = jwt_decode(token);
    if (requiredGroup && decoded.group !== requiredGroup) {
      return <Navigate to="/" />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Error al decodificar el token", error);
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
