// src/routes/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from '../components/login/login';
import Home from '../pages/home';
import Register from '../components/register/register';
import ProtectedRoute from '../components/ProtectedRoute';
import AppHeader from '../components/header/Header';
import Ventas from '../components/ventas/ventas';
import CajaTemp from '../components/CajaTemp/CajaTemp';




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

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path='/ventas' element={<Ventas />}/>
          <Route path='/caja' element={<CajaTemp/>}/> 
          
          {/* Agrega más rutas protegidas aquí */}
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
