
// import { Layout, Table, Button, Input, Space, Card } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import './CajaTemp.css'
// import React, { useState } from 'react';
import moment from 'moment';



import React, { useState } from 'react';
import { Layout,Button, Card, Divider, Radio, Table, Flex } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { start } from 'repl';

const { Sider, Content } = Layout; //destructuro el layout puede ser header sider content footer


interface DataType {
  key: React.Key;
  fecha: string;
  turno: string;
  estado: string;
  montoIni: number; 
  montoFin: number;
}

const columns: TableColumnsType<DataType> = [
  {title: 'Fecha',dataIndex: 'fecha',sorter: (a: any, b: any) => moment(a.fecha, 'DD/MM/YYYY').unix() - moment(b.fecha, 'DD/MM/YYYY').unix() },
  {title: 'Turno',dataIndex: 'turno',
    filters: [
      {
        text: 'Tarde',
        value: 'Tarde',
      },
      {
        text: 'Mañana',
        value: 'Mañana',
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.turno.startsWith(value as string),
    width: '30%',
  },
  {title: 'Estado Caja',dataIndex: 'estado'},
  {title: 'Monto Inicial', dataIndex: 'montoIni'},
  {title: 'Monto Final', dataIndex: 'montoFin'},
  {title: 'Opciones', key: 'opciones', render: (_: any, record: any) => (
    <span>
        <Button icon={<DeleteOutlined style={{ marginRight: '30px' }}/>} type="link" danger onClick={() => console.log('Eliminar', record)} />
        <Button className='add-button' onClick={() => console.log('Editar', record)}>Detalle Venta</Button>
        
    </span>
  ),},
];

const data: DataType[] = [
  {key: '1',fecha: moment().format('DD/MM/YYYY'),turno:"Mañana",estado: 'abierta', montoIni: 100000 , montoFin: 500000 }, //ver como poner fecha
  {key: '2',fecha: moment().subtract(1, 'month').format('DD/MM/YYYY') ,turno:"Mañana",estado: 'abierta', montoIni: 100000 , montoFin: 500000},
  {key: '3',fecha: moment().subtract(2, 'year').format('DD/MM/YYYY'),turno:"Mañana",estado: 'abierta', montoIni: 100000 , montoFin: 500000},
  {key: '4',fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'),turno:"Mañana",estado: 'abierta', montoIni: 100000 , montoFin: 500000},
  {key: '5',fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'),turno:"Tarde",estado: 'abierta', montoIni: 100000 , montoFin: 500000},
  {key: '6',fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'),turno:"Tarde",estado: 'abierta', montoIni: 100000 , montoFin: 500000},
  {key: '7',fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'),turno:"Tarde",estado: 'abierta', montoIni: 100000 , montoFin: 500000},
  {key: '8',fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'),turno:"Tarde",estado: 'abierta', montoIni: 100000 , montoFin: 500000},
];

// El objeto rowSelection indica la necesidad de selección de filas
const rowSelection: TableProps<DataType>['rowSelection'] = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => { //on change es una función que se ejecuta cada vez que cambia la selección de filas.
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows); //Es un array de claves (React.Key[]) que representa las claves únicas de las filas seleccionadas.
    // selectrows Es un array de objetos (DataType[]) que contiene los datos completos de las filas seleccionadas.
  },
  getCheckboxProps: (record: DataType) => ({ //record: Representa el objeto de datos de la fila actual.
    disabled: record.turno === 'Disabled User', //indica si el checkbox esta deshabilitado.si el name del registro es 'Disabled User' lo deshabilita
    name: record.turno,
  }),
};



const CajaTemp: React.FC = () => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox'); //por deefecto checbok xq borre el radio

  return (
      <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
            <Sider width={250} className="sider">
                <div style={{ padding: '16px', fontSize: '25px', fontWeight: 'bold' }}>
                  <FolderOutlined style={{ marginRight: '8px' }} /> Caja {/* Ícono agregado */}  
                </div> {/* Título agregado */}
                <Card title="Filtros" bordered={true} className="filters-card">
                    <Button type="primary" className="clear-filters-button">Limpiar filtros</Button>
                </Card>
            </Sider>
          <Layout>
            <Content style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                  <Button className='button-init-amount' icon={<PlusCircleOutlined />}>Monto Inicial</Button>
                  <Button className='open-box' icon={<PlusCircleOutlined />}>Abrir Caja</Button>
              </div>
              <Divider />
              <Table<DataType>
            rowSelection={{ type: selectionType, ...rowSelection }}
            columns={columns} //pasa los titulos de la columna
            dataSource={data} // pasa los datos de las filas
            pagination={{
              pageSize: 5, // Número de filas por página
              //showSizeChanger: true, // Permite cambiar el número de filas por página
              pageSizeOptions: ['5', '10', '20'], // Opciones de tamaño de página
              defaultCurrent: 1, // Página por defecto
              position: ['bottomCenter'], // Posición de la paginación left o right
            }}/>
            </Content>
          </Layout>
    </Layout>
  );
};

export default CajaTemp;
