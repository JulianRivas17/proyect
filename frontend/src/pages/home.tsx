// src/pages/home.tsx
import React, { useState } from 'react';
import { Layout, Card, Button, Input, Row, Col, DatePicker, Tag, Breadcrumb } from 'antd';
import './home.css';
import { CloseCircleOutlined, MenuOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Sider, Content } = Layout;
const { RangePicker } = DatePicker;

const Home: React.FC = () => {
  const [dateFilters, setDateFilters] = useState<{ start: string; end: string }[]>([]);

  // Maneja la selección de fechas y crea una nueva etiqueta
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      const newFilter = { start: dateStrings[0], end: dateStrings[1] };
      setDateFilters([...dateFilters, newFilter]);
    }
  };

  // Elimina una etiqueta de filtro de fecha
  const handleRemoveDateFilter = (index: number) => {
    setDateFilters(dateFilters.filter((_, i) => i !== index));
  };

  return (
    <div style={{ marginTop: '4rem'}}>
        <div className="container-bread-crumb" style={{display: 'flex', alignItems: 'center', padding:'15px 0px'}}>
                        <MenuOutlined style={{ fontSize: '14px', marginRight: '8px' }} />
                        <Breadcrumb>
                            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                            <Breadcrumb.Item className="item-focus">Dashboard</Breadcrumb.Item>
                        </Breadcrumb>
        </div>
        <div className="container-head-dash" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div className="title-screen">
            Dashboard
            </div>
        </div>    
        
        <Layout style={{ minHeight: '65vh', overflow: 'hidden'}}>
            <Sider width={250} className="sider">
                <Card title="Filtros" bordered={false} className="filters-card">
                    <Button type="primary" className="clear-filters-button">Limpiar filtros</Button>
                </Card>
            </Sider>

            <Content>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Gráfico de Barras" className="chart-card">
                  {/* Placeholder para gráfico de barras */}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Gráfico de Dona" className="chart-card">
                  {/* Placeholder para gráfico de dona */}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Gráfico de Barras Vertical" className="chart-card">
                  {/* Placeholder para gráfico de barras vertical */}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Gráfico de Línea" className="chart-card">
                  {/* Placeholder para gráfico de línea */}
                </Card>
              </Col>
            </Row>
          </Content>
            </Layout>

    </div>
);


};

export default Home;
