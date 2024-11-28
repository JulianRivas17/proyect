import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Breadcrumb, Card, Modal, Input, message, Tooltip, Select } from 'antd';
import { PlusCircleOutlined, MenuOutlined, LockOutlined } from '@ant-design/icons';
import { listarCajas, abrirCaja, cerrarCaja } from '../../services/cajaService'; // Asegúrate de importar el servicio correctamente
import moment from 'moment';
import { ColumnType } from 'antd/es/table';

const { Sider, Content } = Layout;
const { Option } = Select;
interface Caja {
  key: React.Key;
  fecha: string;
  estado: string;
  montoIni: number;
  montoFin: number;
  id: number; // ID de la caja
}

const CajaTemp: React.FC = () => {
  const [cajas, setCajas] = useState<Caja[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [montoInicial, setMontoInicial] = useState<number>(0);
  const [nombreCaja, setNombreCaja] = useState<string>(''); // Estado para el nombre de la caja
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState<string>(''); // Filtro de ordenación
  const [sortOrder, setSortOrder] = useState<string>('  '); // Orden de la columna
  const [filterCaja, setFilterCaja] = useState<string>('');
  const [filterEstado, setFilterEstado] = useState<string>('');
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
  }, [sortField, sortOrder,filterCaja, filterEstado ]);


  const loadDataCaja = async () => {
    const filtros = {
      sortField: sortField,
      sortOrder: sortOrder,
      nombre: filterCaja,
      estado: filterEstado
    };
    const data = await listarCajas(filtros);
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

  const handleCerrarCaja = async (id: number) => {
    try {
      await cerrarCaja(id);
      message.success('Caja cerrada exitosamente.');
      loadDataCaja();
    } catch (error) {
      message.error('Hay ventas impagas pertenecientes a la caja seleccionada.');
    }
  };

  const showConfirm = (id: number) => {
    Modal.confirm({
      title: '¿Está seguro que desea cerrar esta caja?',
      content: 'Una vez cerrada la caja, no podrá realizar más operaciones en ella.',
      okText: 'Sí, cerrar',
      cancelText: 'Cancelar',
      onOk() {
        // Si el usuario confirma, llamamos a handleCerrarCaja
        handleCerrarCaja(id);
      },
      onCancel() {
        // Si el usuario cancela, no hacemos nada
        console.log('Cancelado');
      },
    });
  };

  const handleTableChange = (field: string) => {
    const newSortOrder = sortOrder === 'ascend' ? 'descend' : 'ascend';
    console.log('Nuevo sortOrder:', newSortOrder);
    
    setSortField(field);
    setSortOrder(newSortOrder);
  };
  
  const columns: Array<ColumnType<Caja>> = [
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleTableChange('fecha_hs_aper_caja'),
      }),
    },
    {
      title: 'Nombre Caja',
      dataIndex: 'nombre',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleTableChange('nombre'),
      }),
    },
    {
      title: 'Estado Caja',
      dataIndex: 'estado',
    },
    {
      title: 'Monto Inicial',
      dataIndex: 'montoIni',
      sorter: true,
      render: (monto: number) => monto.toFixed(2),
      onHeaderCell: () => ({
        onClick: () => handleTableChange('monto_inicial_caja'),
      }),
    },
    {
      title: 'Monto Final',
      dataIndex: 'montoFin',
      sorter: true,
      render: (monto: number) => monto.toFixed(2),
      onHeaderCell: () => ({
        onClick: () => handleTableChange('total_saldo_caja'),
      }),
    },
    {
      title: 'Total ventas',
      dataIndex: 'total_ventas',
      sorter: true,
      render: (monto: number) => {
        return monto != null ? monto.toFixed(2) : '0.00'; 
      },
      onHeaderCell: () => ({
        onClick: () => handleTableChange('total_ventas'),
      }),
    },
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
                onClick={() => showConfirm(record.id)}
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
              <Select 
                placeholder="Selecciona un estado"
                value={filterEstado}
                onChange={setFilterEstado}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value="">Todos</Option>
                <Option value="true">Abierta</Option>
                <Option value="Cerrada">Cerrada</Option>
              </Select>

            <div style={{marginTop: "15px" }}>
              <Input
                value={filterCaja}
                onChange={(e) => setFilterCaja(e.target.value)}
                placeholder="Nombre de la caja"
                allowClear
              />
            </div> 
            <Button style={{marginTop: "15px" }} type="primary" className="clear-filters-button">Limpiar filtros</Button>
          </Card>
        </Sider>

        <Layout className="layout-content">
          <Content style={{ padding: '0px 20px', marginTop: '-20px' }}>
            <Table
              columns={columns}
              dataSource={cajas}
              rowKey="key"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                onChange: (page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                },
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '50'],
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
        okText="Abrir caja"  
        cancelText="Cancelar"
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
