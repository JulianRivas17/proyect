import React, { useEffect, useState } from 'react';
import { Layout, Button, Card, Table, Breadcrumb, message } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { TableColumnsType, TableProps } from 'antd';
import { listarCajas } from '../../services/cajaService';
import './caja.css';
import ModalMontoInicial from './modal/montoIniModal';
import ModalAperturaCaja from './modal/modalAperturaCaja'; // Importamos el nuevo modal

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
        sorter: (a: DataType, b: DataType) => moment(a.fecha, 'DD/MM/YYYY').unix() - moment(b.fecha, 'DD/MM/YYYY').unix(),
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
                <Button icon={<DeleteOutlined style={{ marginRight: '30px' }} />} type="link" danger onClick={() => console.log('Eliminar', record)} />
                <Button className="add-button" onClick={() => console.log('Editar', record)}>Detalle Venta</Button>
            </span>
        ),
    },
];

// Configuración de selección de filas
const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: DataType) => ({
        disabled: record.turno === 'Disabled User',
        name: record.turno,
    }),
};

const CajaTemp: React.FC = () => {
    const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [data, setData] = useState<DataType[]>([]); // Estado para almacenar datos de la API
    const [loading, setLoading] = useState<boolean>(false);
    const [isMontoModalVisible, setIsMontoModalVisible] = useState<boolean>(false);
    const [isAperturaModalVisible, setIsAperturaModalVisible] = useState<boolean>(false);
    const [montoInicialSet, setMontoInicialSet] = useState<boolean>(false); // Nuevo estado para controlar el monto inicial

    const [montoInicial, setMontoInicial] = useState<number | null>(null); //estado agregado para el monto

    // Función para obtener datos desde la API
    const fetchCajas = async () => {
        setLoading(true);
        try {
            const response = await listarCajas();
            const formattedData = response.map((item: any, index: number) => ({
                key: index,
                fecha: moment(item.fecha).format('DD/MM/YYYY'),
                turno: item.turno,
                estado: item.estado,
                montoIni: item.montoIni,
                montoFin: item.montoFin,
            }));
            setData(formattedData);
        } catch (error) {
            console.error('Error al obtener las cajas:', error);
            message.error('Error al cargar los datos de la caja');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCajas(); // Carga los datos al montar el componente
    }, []);

    // Funciones para manejar la visibilidad de los modales
    const showMontoModal = () => {
        setIsMontoModalVisible(true);
    };

    const closeMontoModal = () => {
        setIsMontoModalVisible(false);
        setMontoInicialSet(true); // Marcamos el monto inicial como establecido cuando se cierra el modal
    };

    const showAperturaModal = () => {
        setIsAperturaModalVisible(true);
    };

    const closeAperturaModal = () => {
        setIsAperturaModalVisible(false);
    };

    const handleMontoSet = (monto: number) => {
        setMontoInicial(monto); // Guardamos el monto inicial ingresado
    };


    return (
        <div style={{ marginTop: '4rem' }}>
            <div className="container-bread-crumb" style={{ display: 'flex', alignItems: 'center', padding: '15px 0px' }}>
                <MenuOutlined style={{ fontSize: '14px', marginRight: '8px' }} />
                <Breadcrumb>
                    <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                    <Breadcrumb.Item className="item-focus">Caja</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="container-head-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="title-screen">Caja</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <Button className="add-button" icon={<PlusCircleOutlined />} onClick={showMontoModal}>Monto Inicial</Button>
                    <Button className="add-button" icon={<PlusCircleOutlined />} disabled={!montoInicialSet} onClick={showAperturaModal}>
                        Abrir Caja
                    </Button>
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
                            rowSelection={{ type: selectionType, ...rowSelection }}
                            columns={columns}
                            dataSource={data} // Usamos el estado 'data' que contiene los datos de la API
                            loading={loading} // Indicador de carga
                            pagination={{
                                pageSize: 5,
                                pageSizeOptions: ['5', '10', '20'],
                                defaultCurrent: 1,
                                position: ['bottomCenter'],
                            }}
                        />
                    </Content>
                </Layout>
            </Layout>
            {/* Modal para Monto Inicial */}
            {isMontoModalVisible && <ModalMontoInicial visible={isMontoModalVisible} onClose={closeMontoModal} onMontoSet={handleMontoSet} />}
            {/* Modal para Apertura de Caja */}
            {isAperturaModalVisible && <ModalAperturaCaja visible={isAperturaModalVisible} onClose={closeAperturaModal} montoInicial={montoInicial?? 0}/>}
        </div>
    );
};

export default CajaTemp;
