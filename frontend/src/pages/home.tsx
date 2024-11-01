import React, { useState } from 'react';
import { Layout, Card, Button, Breadcrumb, Row, Col } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import './home.css';

const { Sider, Content } = Layout;

const Home: React.FC = () => {
  const [dateFilters, setDateFilters] = useState<{ start: string; end: string }[]>([]);

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      const newFilter = { start: dateStrings[0], end: dateStrings[1] };
      setDateFilters([...dateFilters, newFilter]);
    }
  };

  // Configuración del gráfico de barras
  const barOption = {
    title: {
      text: '',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Ventas',
        type: 'bar',
        data: [12, 19, 3, 5, 2, 3],
        itemStyle: {
          color: 'rgba(75, 192, 192, 0.8)',
        },
      },
    ],
  };

  // Configuración del gráfico de línea
  const lineOption = {
    title: {
      text: '',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Ventas',
        type: 'line',
        data: [12, 19, 3, 5, 2, 3],
        itemStyle: {
          color: 'rgba(75, 192, 192, 1)',
        },
        lineStyle: {
          width: 2,
        },
      },
    ],
  };

  const donutChartOptions = {
    title: {
      text: '',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
       top: '20%'
    },
    series: [
      {
        name: 'Colores',
        type: 'pie',
        radius: ['40%', '70%'], 
        data: [
          { value: 300, name: 'Rojo' },
          { value: 50, name: 'Azul' },
          { value: 100, name: 'Amarillo' },
        ],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
      },
    ],
  };

  const areaChartOptions = {
    title: {
      text: '',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Servicio A',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        data: [120, 132, 101, 134, 90, 230],
        itemStyle: {
          color: '#58a6ff',
        },
      },
      {
        name: 'Servicio B',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        data: [220, 182, 191, 234, 290, 330],
        itemStyle: {
          color: '#ff914d',
        },
      },
      {
        name: 'Servicio C',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        data: [150, 232, 201, 154, 190, 330],
        itemStyle: {
          color: '#7D5BA6',
        },
      },
    ],
  };

  return (
    <div style={{ marginTop: '4rem' }}>
      <div className="container-bread-crumb" style={{ display: 'flex', alignItems: 'center', padding: '15px 0px' }}>
        <MenuOutlined style={{ fontSize: '14px', marginRight: '8px' }} />
        <Breadcrumb>
          <Breadcrumb.Item>Inicio</Breadcrumb.Item>
          <Breadcrumb.Item className="item-focus">Dashboard</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="container-head-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="title-screen">Dashboard</div>
      </div>

      <Layout style={{ minHeight: '65vh', overflow: 'hidden' }}>
        <Sider width={250} className="sider">
          <Card title="Filtros" bordered={false} className="filters-card">
            <Button type="primary" className="clear-filters-button">Limpiar filtros</Button>
          </Card>
        </Sider>

        <Content>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Gráfico de Barras" className="chart-card">
                <ReactECharts option={barOption} style={{ height: '300px', width: '100%', marginTop: '-50px' }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Gráfico de Línea" className="chart-card">
                <ReactECharts option={lineOption} style={{ height: '300px', width: '100%',  marginTop: '-50px'  }} />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Gráfico de Línea" className="chart-card">
                <ReactECharts option={donutChartOptions} style={{ height: '300px', width: '100%',  marginTop: '-50px'  }} />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Gráfico de Línea" className="chart-card">
                <ReactECharts option={areaChartOptions} style={{ height: '300px', width: '100%',  marginTop: '-50px'  }} />
              </Card>
            </Col>
            
          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
