import React, { useState } from 'react';
import { Layout, Card, Button, Table, Breadcrumb } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExportOutlined, MenuOutlined } from '@ant-design/icons';
import moment from 'moment';
import './ventas.css';

const { Sider, Content } = Layout;

const Ventas: React.FC = () => {
    const [data] = useState([
        { key: '1', fecha: moment().format('DD/MM/YYYY'), productos: 'Producto 1, Producto 2', montoTotal: 1200, turno: 'Mañana' },
        { key: '2', fecha: moment().subtract(1, 'days').format('DD/MM/YYYY'), productos: 'Producto 3, Producto 4', montoTotal: 3000, turno: 'Tarde' },
        { key: '3', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '4', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '5', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '6', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '7', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '8', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '9', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '10', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '11', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '12', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '13', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '14', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
        { key: '15', fecha: moment().subtract(2, 'days').format('DD/MM/YYYY'), productos: 'Producto 5, Producto 6', montoTotal: 4500, turno: 'Noche' },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
            console.log('Selected row keys:', selectedRowKeys);
            console.log('Selected rows:', selectedRows);
        },
    };

    const columns = [
        { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', sorter: (a: any, b: any) => moment(a.fecha, 'DD/MM/YYYY').unix() - moment(b.fecha, 'DD/MM/YYYY').unix() },
        { title: 'Productos', dataIndex: 'productos', key: 'productos' },
        { title: 'Monto Total (AR$)', dataIndex: 'montoTotal', key: 'montoTotal', sorter: (a: any, b: any) => a.montoTotal - b.montoTotal, render: (monto: number) => `$ ${monto.toFixed(2)}` },
        { title: 'Turno', dataIndex: 'turno', key: 'turno', filters: [{ text: 'Mañana', value: 'Mañana' }, { text: 'Tarde', value: 'Tarde' }, { text: 'Noche', value: 'Noche' }], onFilter: (value: any, record: any) => record.turno.includes(value) },
        {
            title: 'Opciones', key: 'opciones', render: (_: any, record: any) => (
                <span>
                    <Button icon={<EditOutlined />} type="link" onClick={() => console.log('Editar', record)} />
                    <Button icon={<DeleteOutlined />} type="link" danger onClick={() => console.log('Eliminar', record)} />
                </span>
            ),
        },
    ];

    return (
        <div style={{ marginTop: '4rem'}}>
            <div className="container-bread-crumb" style={{display: 'flex', alignItems: 'center', padding:'15px 0px'}}>
                            <MenuOutlined style={{ fontSize: '14px', marginRight: '8px' }} />
                            <Breadcrumb>
                                <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                                <Breadcrumb.Item className="item-focus">Ventas</Breadcrumb.Item>
                            </Breadcrumb>
            </div>
            <div className="container-head-dash" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div className="title-screen">
                Ventas
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <Button className='add-button' icon={<ExportOutlined />}>Exportar Data</Button>
                    <Button className='add-button' type="primary" icon={<PlusOutlined />}>Añadir Venta</Button>
                </div> 
            </div>    
            
            <Layout style={{ minHeight: '65vh', overflow: 'hidden'}}>
                <Sider width={250} className="sider">
                    <Card title="Filtros" bordered={false} className="filters-card">
                        <Button type="primary" className="clear-filters-button">Limpiar filtros</Button>
                    </Card>
                </Sider>

                <Layout className="layout-content">
                    <Content style={{ padding: '0px 20px', marginTop: '-20px'}}>
                        <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="key"
                        rowSelection={rowSelection}
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
                        onChange={handleTableChange}
                    />
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};

export default Ventas;
