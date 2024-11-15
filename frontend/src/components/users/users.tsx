import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Table, Breadcrumb, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { eliminarUsuario, listarUsuarios } from '../../services/usersService';
import NuevoEmpleadoModal from './model/add-user-model';
import './users.css';
import EditUserModal from './model/edit-user-model';
import { getUserIdFromToken } from '../../services/authService';

const { Sider, Content } = Layout;

interface User {
    key: string;
    id: number;
    dni: string;
    nombre: string;
    apellido: string;
    rol: string[];
    email: string;
}

const Users: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);


    const fetchUsers = async () => {
        try {
            const response = await listarUsuarios();
            const usuariosData = response.map((user: any) => ({
                key: user.id.toString(),
                id: user.id,
                dni: user.dni || '',
                nombre: user.first_name || user.nombre || '',
                apellido: user.last_name || user.apellido || '',
                rol: user.assigned_roles && user.assigned_roles.length > 0 ? user.assigned_roles[0] : 'Sin rol',
                email: user.email || '',
            }));
            setData(usuariosData);
        } catch (error) {
            message.error('Error al cargar los usuarios');
            console.error('Error al cargar los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleEditUser = (userId: number) => {
        setSelectedUserId(userId);
        setIsEditModalVisible(true);
    };

    const handleEditComplete = () => {
        fetchUsers(); // Recargar la lista de usuarios
        setIsEditModalVisible(false); // Cerrar el modal
    };

    const handleDeleteUser = (userId: number) => {
        const currentUserId = getUserIdFromToken(); // Obtener el ID del usuario autenticado
    
        if (currentUserId === userId) {
            message.error('No puedes eliminar tu propio usuario');
            return; // Evitar que se elimine el usuario
        }
    
        Modal.confirm({
            title: '¿Estás seguro de que quieres eliminar este usuario?',
            content: 'Esta acción no se puede deshacer',
            onOk: async () => {
                try {
                    await eliminarUsuario(userId);
                    message.success('Usuario eliminado exitosamente');
                    fetchUsers(); // Actualizar la lista de usuarios después de eliminar
                } catch (error) {
                    message.error('Error al eliminar el usuario');
                    console.error('Error al eliminar el usuario:', error);
                }
            },
        });
    };
    

    const columns = [
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        { title: 'Apellido', dataIndex: 'apellido', key: 'apellido' },
        {
            title: 'Rol',
            dataIndex: 'rol',
            key: 'rol',
            filters: [
                { text: 'Admin', value: 'Admin' },
                { text: 'Usuario', value: 'Usuario' },
                { text: 'Editor', value: 'Editor' },
            ],
            onFilter: (value: any, record: any) => record.rol.includes(value),
        },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Opciones',
            key: 'opciones',
            render: (_: any, record: any) => (
                <span>
                    <Button icon={<EditOutlined />} type="link" onClick={() => handleEditUser(record.id)} />
                    <Button icon={<DeleteOutlined />} type="link" danger onClick={() => handleDeleteUser(record.id)} />
                </span>
            ),
        },
    ];

    return (
        <div style={{ marginTop: '4rem' }}>
            <div className="container-bread-crumb" style={{ display: 'flex', alignItems: 'center', padding: '15px 0px' }}>
                <MenuOutlined style={{ fontSize: '14px', marginRight: '8px', cursor: 'pointer' }} />
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/dashboard">Inicio</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="item-focus">Gestión de Empleados</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="container-head-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="title-screen">Gestión de empleados</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <Button
                        className="add-button"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Nuevo Empleado
                    </Button>
                </div>
            </div>

            <Layout style={{ minHeight: '100vh', overflow: 'hidden' }}>
                <Sider width={250} className="sider">
                    <Card title="Filtros" bordered={false} className="filters-card">
                        <Button type="primary" className="clear-filters-button">
                            Limpiar filtros
                        </Button>
                    </Card>
                </Sider>

                <Layout className="layout-content">
                    <Content style={{ padding: '0px 20px', marginTop: '-20px' }}>
                        <Table
                            columns={columns}
                            dataSource={data}
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
                            onChange={handleTableChange}
                        />
                    </Content>
                </Layout>
            </Layout>

            {isModalVisible && (
                <NuevoEmpleadoModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onAddComplete={() => {
                        fetchUsers(); // Recarga la lista de usuarios
                        setIsModalVisible(false); // Cierra el modal
                    }}
                />
            )}

            {isEditModalVisible && (
                <EditUserModal
                    visible={isEditModalVisible}
                    userId={selectedUserId || 0}
                    onCancel={() => setIsEditModalVisible(false)}
                    onEditComplete={handleEditComplete}
                />
            )}
        </div>
    );
};

export default Users;

