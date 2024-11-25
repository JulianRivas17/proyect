import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Breadcrumb, Card } from 'antd';
import { PlusCircleOutlined, MenuOutlined, DeleteOutlined } from '@ant-design/icons';
import { listarCajas } from '../../services/cajaService'; // Asegúrate de importar el servicio correctamente
import moment from 'moment';

const { Sider, Content } = Layout; //destructuro el layout puede ser header sider content footer

interface DataType {
    key: React.Key;
    fecha: string;
    turno: string;
    estado: string;
    montoIni: number;
    montoFin: number;
}

const columns = [
  { title: 'Fecha', dataIndex: 'fecha', sorter: (a: any, b: any) => moment(a.fecha, 'DD/MM/YYYY').unix() - moment(b.fecha, 'DD/MM/YYYY').unix() },
  { title: 'Turno', dataIndex: 'turno' },
  { title: 'Estado Caja', dataIndex: 'estado' },
  { title: 'Monto Inicial', dataIndex: 'montoIni' },
  { title: 'Monto Final', dataIndex: 'montoFin' },
  {
    title: 'Opciones', key: 'opciones', render: (_: any, record: any) => (
      <span>
        <Button icon={<DeleteOutlined />} type="link" danger onClick={() => console.log('Eliminar', record)} />
        <Button className='add-button' onClick={() => console.log('Editar', record)}>Detalle Venta</Button>
      </span>
    ),
  },
];

const CajaTemp: React.FC = () => {
  const [cajas, setCajas] = useState<DataType[]>([]);  // Estado para almacenar las cajas
  const [loading, setLoading] = useState(false);  // Estado para manejar la carga de datos

  // Llamada a la API para obtener las cajas
  useEffect(() => {
    const fetchCajas = async () => {
      setLoading(true);
      try {
        const data = await listarCajas();  // Llamada al servicio
        const formattedData = data.map((caja: any, index: number) => ({
          key: index + 1,
          fecha: moment(caja.fecha_hs_aper_caja).format('DD/MM/YYYY'),
          turno: caja.estado_caja ? 'Abierta' : 'Cerrada',
          estado: caja.estado_caja ? 'Abierta' : 'Cerrada',
          montoIni: parseFloat(caja.monto_inicial_caja),
          montoFin: caja.total_saldo_caja ? parseFloat(caja.total_saldo_caja) : 0,
        }));
        setCajas(formattedData);
      } catch (error) {
        console.error('Error al obtener las cajas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCajas();
  }, []);

  return (
    <div style={{ marginTop: '4rem' }}>
      <div className="container-bread-crumb" style={{ display: 'flex', alignItems: 'center', padding: '15px 0px' }}>
        <MenuOutlined style={{ fontSize: '14px', marginRight: '8px' }} />
        <Breadcrumb>
          <Breadcrumb.Item>Inicio</Breadcrumb.Item>
          <Breadcrumb.Item>Caja</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="container-head-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="title-screen">Caja</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
          <Button className='add-button ' icon={<PlusCircleOutlined />}>Abrir Caja</Button>
        </div>
      </div>

      <Layout style={{ minHeight: '65vh', overflow: 'hidden' }}>
        <Sider width={250} className="sider">
          <Card title="Filtros" bordered={false} className="filters-card">
            <Button type="primary" className="clear-filters-button">Limpiar filtros</Button>
          </Card>
        </Sider>

        <Layout className="layout-content">
          <Content style={{ padding: '0px 20px', marginTop: '-20px' }}>
            <Table<DataType>
              columns={columns}
              dataSource={cajas}  // Utiliza los datos obtenidos de la API
              rowKey="key"
              pagination={{
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20'],
                defaultCurrent: 1,
                position: ['bottomCenter'],
              }}
              loading={loading}  // Agrega la propiedad loading para mostrar el spinner de carga
            />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default CajaTemp;
