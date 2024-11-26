import React, { useState, useEffect, useRef } from 'react';
import { Layout, Button, Card, Breadcrumb, Row, Col, DatePicker, message } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import moment from 'moment';
import { fetchChartData } from '../services/chartService';

const { Sider, Content } = Layout;

const Home: React.FC = () => {
  const [dateFilters, setDateFilters] = useState<{ start: string; end: string }[]>([]);
  const [barOption, setBarOption] = useState<any>({}); // Para el gráfico de barras
  const [lineOption, setLineOption] = useState<any>({}); // Para el gráfico de línea
  const [donutChartOptions, setDonutChartOptions] = useState<any>({}); // Para el gráfico de dona
  const [areaChartOptions, setAreaChartOptions] = useState<any>({}); // Para el gráfico de áreas
  const [loading, setLoading] = useState(false); // Para controlar el estado de carga
  const [key, setKey] = useState(0);



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dataBar = await fetchChartData('bar', dateFilters[0]?.start, dateFilters[0]?.end);
        const dataLine = await fetchChartData('line', dateFilters[0]?.start, dateFilters[0]?.end);
        const dataDonut = await fetchChartData('donut', dateFilters[0]?.start, dateFilters[0]?.end);
        const dataArea = await fetchChartData('area', dateFilters[0]?.start, dateFilters[0]?.end);

        setBarOption({
          title: { text: '' },
          tooltip: {},
          xAxis: { type: 'category', data: dataBar.map((d: any) => d.mes) },
          yAxis: { type: 'value' },
          series: [{
            name: 'Ventas',
            type: 'bar',
            data: dataBar.map((d: any) => d.total_ventas),
            itemStyle: { color: 'rgba(75, 192, 192, 0.8)' },
          }],
        });

        setLineOption({
          title: { text: '' },
          tooltip: { trigger: 'axis' },
          xAxis: { type: 'category', data: dataLine.map((d: any) => d.fecha) },
          yAxis: { type: 'value' },
          series: [{
            name: 'Ventas',
            type: 'line',
            data: dataLine.map((d: any) => d.total_ventas),
            itemStyle: { color: 'rgba(75, 192, 192, 1)' },
            lineStyle: { width: 2 },
          }],
        });

        setDonutChartOptions({
          title: { text: '', left: 'center' },
          tooltip: { trigger: 'item' },
          legend: {
            orient: 'vertical',
            left: 'left',
            top: '30%',
          },
          series: [{
            name: 'Estado de las Ventas',
            type: 'pie',
            radius: ['40%', '70%'],
            data: dataDonut.map((d: any) => ({ value: d.cantidad, name: d.estado_pedido })),
            itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          }],
        });

        setAreaChartOptions({
          title: { text: '', left: 'center' },
          tooltip: { trigger: 'axis' },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dataArea.data.map((d: any) => moment(d.fecha_hs_aper_caja).format('YYYY-MM-DD')), // Formatear la fecha
          },
          yAxis: {
            type: 'value',
            name: 'Ventas',
            axisLabel: {
              formatter: '{value} $',
            },
          },
          series: [{
            name: 'Ventas por Caja',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: dataArea.data.map((d: any) => d.total_ventas_annotated), // Asegúrate de usar el campo correcto
            itemStyle: { color: '#58a6ff' },
          }],
        });

      } catch (error) {
        console.log(error)
        message.error('Error al obtener los datos del gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateFilters]);


  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      const newFilter = { start: dateStrings[0], end: dateStrings[1] };
      setDateFilters([newFilter]); // Solo se guarda un rango de fechas
    }
  };

  const handleClearFilter = () => {
    setDateFilters([]); // Limpiar el estado de los filtros de fecha
    setKey(key + 1); // Cambiar la clave para forzar la re-renderización del DatePicker
  };

  return (
    <div style={{ marginTop: '4rem' }}>
      <div className="container-bread-crumb" style={{ display: 'flex', alignItems: 'center', padding: '15px 0px' }}>
        <Breadcrumb >
          <MenuOutlined style={{ fontSize: '14px', marginRight: '8px' }} />
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
            <DatePicker.RangePicker onChange={handleDateChange} key={key}  />
            <Button style={{marginTop: "20px"}} type="primary" onClick={() => handleClearFilter()}>Limpiar filtros</Button>
          </Card>
        </Sider>

        <Content style={{ marginRight: "20px" }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Ventas Mensuales" className="chart-card">
                <ReactECharts option={barOption} style={{ height: '300px', width: '100%', marginTop: '-50px' }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Tendencia de Ventas" className="chart-card">
                <ReactECharts option={lineOption} style={{ height: '300px', width: '100%', marginTop: '-50px' }} />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Distribución de Estados de Ventas" className="chart-card">
                <ReactECharts option={donutChartOptions} style={{ height: '300px', width: '100%', marginTop: '-50px' }} />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Comparativa de Ventas por Caja" className="chart-card">
                <ReactECharts option={areaChartOptions} style={{ height: '300px', width: '100%', marginTop: '-50px' }} />
              </Card>
            </Col>

          </Row>
        </Content>
      </Layout>
    </div>
  );
};

export default Home;
