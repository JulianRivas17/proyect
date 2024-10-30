// src/components/Header.tsx
import React from 'react';
import { Menu, Layout, Button } from 'antd';
import { Link } from 'react-router-dom';
import './header.css';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header style={{ background: '#f4f5f7', padding: 0, display: 'block' }}>
      <div className="container-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f4f5f7'}}>
        <div className="logo">
          Brunnete
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
            <Button className='add-button' type="primary">Cerrar sesión</Button>
        </div> 
      </div>
      <div className="horizontal-menu">
        <Menu className="menu-custom" theme="dark" mode="horizontal">
          <Menu.Item className="menu-item-custom" key="1"><Link to="/dashboard" style={{ color: '#fff' }}>Dashboard</Link></Menu.Item>
          <Menu.Item className="menu-item-custom" key="2"><Link to="/ventas" style={{ color: '#fff' }}>Ventas</Link></Menu.Item>
          <Menu.Item className="menu-item-custom" key="3"><Link to="/caja" style={{ color: '#fff' }}>Caja</Link></Menu.Item>
          <Menu.Item className="menu-item-custom" key="4"><Link to="/users" style={{ color: '#fff' }}>Gestión de Usuarios</Link></Menu.Item>
        </Menu>
      </div>
    </Header>
  );
};

export default AppHeader;
