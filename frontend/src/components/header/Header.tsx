// src/components/Header.tsx
import React from 'react';
import { Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header style={{ background: '#51971A', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
      <div className="logo" style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginRight: '20px' }}>
        Brunette
      </div>
      <Menu theme="dark" mode="horizontal" style={{ backgroundColor: '#51971A', flexGrow: 1 }}>
        <Menu.Item key="1"><Link to="/dashboard">Dashboard</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/ventas">Ventas</Link></Menu.Item>
        <Menu.Item key="3"><Link to="/caja">Caja</Link></Menu.Item>
        <Menu.Item key="4"><Link to="/usuarios">Gestión de Usuarios</Link></Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;
