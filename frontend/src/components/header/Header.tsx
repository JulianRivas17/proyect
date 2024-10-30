// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { Menu, Layout, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { getUserGroupFromToken } from '../../services/authService';
import './header.css';

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
      <div className="container-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f4f5f7'}}>
        <div className="logo">
          Brunnete
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
            <Button  onClick={handleLogout} className='add-button' type="primary">Cerrar sesión</Button>
        </div> 
      </div>
      <div className="horizontal-menu">
        <Menu className="menu-custom" theme="dark" mode="horizontal">
        {userGroup === 'Gerente' && (
            <Menu.Item className="menu-item-custom" key="1">
              <Link to="/dashboard" style={{ color: '#fff' }}>Dashboard</Link>
            </Menu.Item>
          )}
          <Menu.Item className="menu-item-custom" key="2"><Link to="/ventas" style={{ color: '#fff' }}>Ventas</Link></Menu.Item>
          <Menu.Item className="menu-item-custom" key="3"><Link to="/caja" style={{ color: '#fff' }}>Caja</Link></Menu.Item>
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
