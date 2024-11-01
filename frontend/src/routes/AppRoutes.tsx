// src/routes/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from '../components/login/login';
import Home from '../pages/home';
import Register from '../components/register/register';
import ProtectedRoute from '../components/ProtectedRoute';
import AppHeader from '../components/header/Header';
import Ventas from '../components/ventas/ventas';
import Users from '../components/users/users';
import CajaTemp from '../components/caja/caja';

const AppRoutes = () => {
  const location = useLocation();

  const hideHeaderPaths = ['/', '/register'];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <>
      {shouldShowHeader && <AppHeader />}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas solo para Gerente */}
        <Route element={<ProtectedRoute requiredGroup="Gerente" />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* Rutas protegidas para cualquier usuario autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/caja" element={<CajaTemp />} />
        </Route>
      </Routes>
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default AppWrapper;
