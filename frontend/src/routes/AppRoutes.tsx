import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/login/login';
import Home from '../pages/home';
import Register from '../components/register/register';
import ProtectedRoute from '../components/ProtectedRoute';  // Importamos el ProtectedRoute

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          {/* Agrega más rutas protegidas aquí */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
