import React, { useState } from 'react';
import { Layout, Card, Button, Table, Breadcrumb} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import './users.css';
import { MenuOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;

const Users: React.FC = () => {
    const [data] = useState([
        { key: '1', dni: '12345678', nombre: 'Juan', apellido: 'Pérez', rol: 'Admin', telefono: '123-456-7890' },
        { key: '2', dni: '87654321', nombre: 'María', apellido: 'Gómez', rol: 'Usuario', telefono: '098-765-4321' },
        { key: '3', dni: '11223344', nombre: 'Carlos', apellido: 'López', rol: 'Editor', telefono: '456-789-1234' },
        { key: '4', dni: '22334455', nombre: 'Ana', apellido: 'Martínez', rol: 'Admin', telefono: '321-654-9870' },
        { key: '5', dni: '33445566', nombre: 'Luis', apellido: 'Ramírez', rol: 'Usuario', telefono: '654-321-0987' },
        { key: '6', dni: '44556677', nombre: 'Sofía', apellido: 'Fernández', rol: 'Editor', telefono: '789-123-4567' },
        { key: '7', dni: '55667788', nombre: 'Diego', apellido: 'Torres', rol: 'Admin', telefono: '147-258-3690' },
        { key: '8', dni: '66778899', nombre: 'Laura', apellido: 'Sánchez', rol: 'Usuario', telefono: '369-258-1470' },
        { key: '9', dni: '77889900', nombre: 'Gabriel', apellido: 'Castro', rol: 'Editor', telefono: '258-147-3690' },
        { key: '10', dni: '88990011', nombre: 'Marta', apellido: 'Silva', rol: 'Usuario', telefono: '123-789-4560' },
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
        { title: 'DNI', dataIndex: 'dni', key: 'dni' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Apellido', dataIndex: 'apellido', key: 'apellido' },
        { title: 'Rol', dataIndex: 'rol', key: 'rol', filters: [{ text: 'Admin', value: 'Admin' }, { text: 'Usuario', value: 'Usuario' }, { text: 'Editor', value: 'Editor' }], onFilter: (value: any, record: any) => record.rol.includes(value) },
        { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
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
                            <MenuOutlined style={{ fontSize: '14px', marginRight: '8px', cursor: 'pointer' }} />
                            <Breadcrumb>
                                <Breadcrumb.Item><Link to="/dashboard">Inicio</Link></Breadcrumb.Item>
                                <Breadcrumb.Item className="item-focus">Gestión de Empleados</Breadcrumb.Item>
                            </Breadcrumb>
            </div>
            <div className="container-head-dash" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div className="title-screen">
                    Gestión de empleados
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <Button className='add-button' type="primary" icon={<PlusOutlined />}>Nuevo Empleado</Button>
                </div> 
            </div>    
            
            <Layout style={{ minHeight: '100vh', overflow: 'hidden'}}>
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

export default Users;
