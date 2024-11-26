import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Breadcrumb, Card, Modal, Input, message, Tooltip } from 'antd';
import { PlusCircleOutlined, MenuOutlined, LockOutlined } from '@ant-design/icons';
import { listarCajas, abrirCaja, cerrarCaja } from '../../services/cajaService'; // Asegúrate de importar el servicio correctamente
import moment from 'moment';

const { Sider, Content } = Layout;

interface DataType {
    key: React.Key;
    fecha: string;
    estado: string;
    montoIni: number;
    montoFin: number;
    id: number; // ID de la caja
}

const CajaTemp: React.FC = () => {
  const [cajas, setCajas] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [montoInicial, setMontoInicial] = useState<number>(0);
  const [nombreCaja, setNombreCaja] = useState<string>(''); // Estado para el nombre de la caja

  // Cargar cajas al montar el componente
  useEffect(() => {
    const fetchCajas = async () => {
      setLoading(true);
      try {
        loadDataCaja();
      } catch (error) {
        console.error('Error al obtener las cajas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCajas();
  }, []);


   const loadDataCaja = async() => {
    const data = await listarCajas();
    console.log("data", data)
    const formattedData = data.map((caja: any) => ({
      key: caja.id,
      fecha: moment(caja.fecha_hs_aper_caja).format('DD/MM/YYYY'),
      nombre: caja.nombre,
      estado: caja.estado_caja ? 'Abierta' : 'Cerrada',
      montoIni: parseFloat(caja.monto_inicial_caja),
      montoFin: caja.total_saldo_caja ? parseFloat(caja.total_saldo_caja) : 0,
      id: caja.id, 
      total_ventas: caja.total_ventas
    }));
    setCajas(formattedData);
  }

  // Manejar la apertura de una caja
  const handleAbrirCaja = async () => {
    if (montoInicial <= 0) {
      message.error('El monto inicial debe ser mayor que 0.');
      return;
    }
    if (!nombreCaja.trim()) { // Validar que el nombre no esté vacío
      message.error('El nombre de la caja es obligatorio.');
      return;
    }

    try {
      await abrirCaja(montoInicial, nombreCaja); // Asegúrate de pasar el nombre a la función del servicio
      message.success('Caja abierta exitosamente.');
      setModalVisible(false);
      setMontoInicial(0);
      setNombreCaja(''); // Limpiar el campo de nombre
      loadDataCaja();
    } catch (error) {
      message.error('Error al abrir la caja.');
    }
  };

  // Manejar el cierre de una caja
  const handleCerrarCaja = async (id: number) => {
    try {
      await cerrarCaja(id);
      message.success('Caja cerrada exitosamente.');
      loadDataCaja();
    } catch (error) {
      message.error('Error al cerrar la caja.');
    }
  };

  const columns = [
    { title: 'Fecha', dataIndex: 'fecha', sorter: (a: any, b: any) => moment(a.fecha, 'DD/MM/YYYY').unix() - moment(b.fecha, 'DD/MM/YYYY').unix() },
    { title: 'Nombre Caja', dataIndex: 'nombre'},
    { title: 'Estado Caja', dataIndex: 'estado' },
    { 
      title: 'Monto Inicial', 
      dataIndex: 'montoIni', 
      render: (monto: number) => monto ? `$${monto.toFixed(2)}` : 'N/A'  // Formato en pesos
    },
    { 
      title: 'Monto Final', 
      dataIndex: 'montoFin', 
      render: (monto: number) => monto ? `$${monto.toFixed(2)}` : 'N/A'  // Formato en pesos
    },
    { title: 'Monto Ventas', dataIndex: 'total_ventas', render: (text: number) => text ? `$${text.toFixed(2)}` : '0' }, 
    {
      title: 'Opciones',
      key: 'opciones',
      render: (_: any, record: any) => (
        <span>
          {record.estado === 'Abierta' && (
           <Tooltip title="Cerrar Caja">
           <Button
             icon={<LockOutlined />}
             type="link"
             onClick={() => handleCerrarCaja(record.id)}
             style={{ color: 'red' }}
           > Cerrar caja</Button>
         </Tooltip>
          )}
        </span>
      ),
    },
  ];

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
          <Button className='add-button ' icon={<PlusCircleOutlined />} onClick={() => setModalVisible(true)}>Abrir Caja</Button>
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
              dataSource={cajas}
              rowKey="key"
              pagination={{
                pageSize: 5,
                pageSizeOptions: ['5', '10', '20'],
                defaultCurrent: 1,
                position: ['bottomCenter'],
              }}
              loading={loading}
            />
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Abrir Caja"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAbrirCaja}
      >
        <div>
          <label>Monto Inicial</label>
          <Input
            type="number"
            value={montoInicial}
            onChange={(e) => setMontoInicial(parseFloat(e.target.value))}
            min={0}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Nombre de la Caja</label>
          <Input
            value={nombreCaja}
            onChange={(e) => setNombreCaja(e.target.value)}
            placeholder="Ingrese el nombre de la caja"
          />
        </div>
      </Modal>
    </div>
  );
};

export default CajaTemp;
