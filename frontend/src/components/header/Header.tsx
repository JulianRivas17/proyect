// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { Menu, Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import './header.css';
import { getUserGroupFromToken } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const { Header } = Layout;


const AppHeader: React.FC = () => {
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const group = getUserGroupFromToken();
    setUserGroup(group);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
  };


  return (
    <Header style={{ background: '#f4f5f7', padding: 0, display: 'block' }}>
      <div className="container-logo">
        <div className="logo">
          Brunnete
        </div>
      </div>
      <div className="horizontal-menu">    
      <Button
          type="primary"
          onClick={handleLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </Button>
        <Menu className="menu-custom" theme="dark" mode="horizontal">
          {/* Renderiza Dashboard solo si el usuario es Gerente */}
          {userGroup === 'Gerente' && (
            <Menu.Item className="menu-item-custom" key="1">
              <Link to="/dashboard" style={{ color: '#fff' }}>Dashboard</Link>
            </Menu.Item>
          )}
          <Menu.Item className="menu-item-custom" key="2">
            <Link to="/ventas" style={{ color: '#fff' }}>Ventas</Link>
          </Menu.Item>
          <Menu.Item className="menu-item-custom" key="3">
            <Link to="/caja" style={{ color: '#fff' }}>Caja</Link>
          </Menu.Item>
          {/* Renderiza Gestión de Usuarios solo si el usuario es Gerente */}
          {userGroup === 'Gerente' && (
            <Menu.Item className="menu-item-custom" key="4">
              <Link to="/users" style={{ color: '#fff' }}>Gestión de Usuarios</Link>
            </Menu.Item>
          )}
        </Menu>
      </div>
    </Header>
  );
};

export default AppHeader;
