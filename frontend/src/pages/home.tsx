// src/pages/home.tsx
import React, { useState } from 'react';
import { Layout, Card, Button, Input, Row, Col, DatePicker, Tag } from 'antd';
import './home.css';
import { CloseCircleOutlined } from '@ant-design/icons';
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
    <>
      <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
        {/* Barra lateral para filtros */}
        <Sider width={250} className="sider">
          <Card title="Filtros" bordered={false} className="filters-card">
            <h4 className="filters-title">Filtros aplicados</h4>
            <Button type="primary" className="clear-filters-button">
              Limpiar filtros
            </Button>

            {/* Etiquetas de filtros aplicados */}
            <div className="date-filters">
              {dateFilters.map((filter, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveDateFilter(index)}
                  icon={<CloseCircleOutlined />}
                  color="green"
                >
                  {moment(filter.start).format('YYYY-MM-DD')} - {moment(filter.end).format('YYYY-MM-DD')}
                </Tag>
              ))}
            </div>

            <RangePicker onChange={handleDateChange} style={{ marginBottom: '10px' }} />
          </Card>
        </Sider>

        {/* Contenido principal para gráficos */}
        <Layout className="layout-content">
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
      </Layout>
    </>
  );
};

export default Home;
