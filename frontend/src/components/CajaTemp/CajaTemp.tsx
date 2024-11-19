
import React, { useState, useEffect } from 'react';
import { Layout, Button, Card, Divider, Table, message } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { TableColumnsType, TableProps } from 'antd';
import axios from 'axios';
import './CajaTemp.css';

const { Sider, Content } = Layout;

interface DataType {
  key: React.Key;
  fecha: string;
  turno: string;
  estado: string;
  montoIni: number;
  montoFin: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Fecha',
    dataIndex: 'fecha',
    sorter: (a: DataType, b: DataType) =>
      moment(a.fecha, 'DD/MM/YYYY').unix() - moment(b.fecha, 'DD/MM/YYYY').unix(),
  },
  {
    title: 'Turno',
    dataIndex: 'turno',
    filters: [
      { text: 'Tarde', value: 'Tarde' },
      { text: 'Mañana', value: 'Mañana' },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.turno.startsWith(value as string),
    width: '30%',
  },
  { title: 'Estado Caja', dataIndex: 'estado' },
  { title: 'Monto Inicial', dataIndex: 'montoIni' },
  { title: 'Monto Final', dataIndex: 'montoFin' },
  {
    title: 'Opciones',
    key: 'opciones',
    render: (_: any, record: any) => (
      <span>
        <Button
          icon={<DeleteOutlined style={{ marginRight: '30px' }} />}
          type="link"
          danger
          onClick={() => console.log('Eliminar', record)}
        />
        <Button className="add-button" onClick={() => console.log('Editar', record)}>
          Detalle Venta
        </Button>
      </span>
    ),
  },
];

// El objeto rowSelection indica la necesidad de selección de filas
const rowSelection: TableProps<DataType>['rowSelection'] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => { //on change es una función que se ejecuta cada vez que cambia la selección de filas.
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows); //Es un array de claves (React.Key[]) que representa las claves únicas de las filas seleccionadas.
  }, // selectrows Es un array de objetos (DataType[]) que contiene los datos completos de las filas seleccionadas.
  getCheckboxProps: (record: DataType) => ({ //record: Representa el objeto de datos de la fila actual.
    disabled: record.turno === 'Disabled User', //indica si el checkbox esta deshabilitado.si el name del registro es 'Disabled User' lo deshabilita
    name: record.turno,
  }),
};

const CajaTemp: React.FC = () => {
  const [selectionType] = useState<'checkbox' | 'radio'>('checkbox'); //por deefecto checbok xq borre el radio
  const [data, setData] = useState<DataType[]>([]); // Estado para almacenar los datos de la tabla
  const [loading, setLoading] = useState<boolean>(false);

  // Función para obtener datos desde la API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/caja'); // Reemplaza con tu endpoint real
      const formattedData = response.data.map((item: any, index: number) => ({
        key: index,
        fecha: moment(item.fecha).format('DD/MM/YYYY'),
        turno: item.turno,
        estado: item.estado,
        montoIni: item.montoIni,
        montoFin: item.montoFin,
      }));
      setData(formattedData);
    } catch (error) {
      message.error('Error al cargar los datos de la caja');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Llama a la API al montar el componente
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Sider width={250} className="sider">
        <div style={{ padding: '16px', fontSize: '25px', fontWeight: 'bold' }}>
          <FolderOutlined style={{ marginRight: '8px' }} /> Caja
        </div>
        <Card title="Filtros" bordered={true} className="filters-card">
          <Button type="primary" className="clear-filters-button">
            Limpiar filtros
          </Button>
        </Card>
      </Sider>
      <Layout>
        <Content style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
            <Button className="button-init-amount" icon={<PlusCircleOutlined />}>
              Monto Inicial
            </Button>
            <Button className="open-box" icon={<PlusCircleOutlined />}>
              Abrir Caja
            </Button>
          </div>
          <Divider />
          <Table<DataType>
            rowSelection={{ type: selectionType, ...rowSelection }}
            columns={columns} //pasa los titulos de la columna
            dataSource={data} // Se pasa el estado 'data' que contiene los datos desde la API
            loading={loading} // Muestra un indicador de carga mientras se obtienen los datos
            pagination={{
              pageSize: 5, // Número de filas por página
              pageSizeOptions: ['5', '10', '20'],
              defaultCurrent: 1, // Página por defecto
              position: ['bottomCenter'], // Posición de la paginación left o right
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CajaTemp;
