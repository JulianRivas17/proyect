import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Table, Breadcrumb, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MenuOutlined, ExportOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { obtenerProductos, ProductoDisponible } from '../../services/ventas_services';
import { agregarProducto, editarProducto, eliminarProducto, obtenerURLImagen } from '../../services/productosService';
import ProductoModal from './modal/add-productos-model';
import EditProductoModal from './modal/edit-productos-model';


const { Sider, Content } = Layout;

const Productos: React.FC = () => {
    const [data, setData] = useState<ProductoDisponible[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const fetchProductos = async () => {
        try {
            const productos = await obtenerProductos();
            setData(productos);
        } catch (error) {
            message.error('Error al cargar los productos');
        }
    };



    useEffect(() => {
        fetchProductos();
    }, []);

    const handleEditClick = (id: number) => {
        setSelectedProductId(id);
        setIsEditModalVisible(true);
    };

    const handleAddProducto = async (formData: FormData) => {
        try {
            await agregarProducto(formData);
            message.success('Producto agregado exitosamente');
            fetchProductos();
        } catch (error) {
            message.error('Error al agregar el producto');
        }
    };

    const handleEditProducto = async (formData: FormData) => {
        if (!selectedProductId) return;
        try {
            await editarProducto(selectedProductId, formData);
            message.success('Producto editado exitosamente');
            fetchProductos();
        } catch (error) {
            message.error('Error al editar el producto');
        }
    };

    const handleDeleteProducto = async (productId: number) => {
        Modal.confirm({
            title: '¿Estás seguro de que quieres eliminar este producto?',
            content: 'Esta acción no se puede deshacer',
            onOk: async () => {
                try {
                    await eliminarProducto(productId);
                    message.success('Producto eliminado exitosamente');
                    fetchProductos();
                } catch (error) {
                    message.error('Error al eliminar el producto');
                }
            },
        });
    };

    const columns = [
        { title: 'Nombre', dataIndex: 'nombre_prod', key: 'nombre_prod' },
        { title: 'Precio', dataIndex: 'precio_prod', key: 'precio_prod' },
        { title: 'Categoria', dataIndex: 'category', key: 'category' },
        { title: 'Descripción', dataIndex: 'description', key: 'description' },
        {
            title: 'Imagen',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (ruta: string) => {
                const urlImagen = obtenerURLImagen(ruta);
                return urlImagen ? (
                    <img src={urlImagen} alt="Producto" style={{ width: 50 }} />
                ) : (
                    'No disponible'
                );
            },
        },
        {
            title: 'Opciones',
            key: 'opciones',
            render: (_: any, record: ProductoDisponible) => (
                <span>
                    <Button
                        icon={<EditOutlined />}
                        type="link"
                        onClick={() => handleEditClick(record.id)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        type="link"
                        danger
                        onClick={() => handleDeleteProducto(record.id)}
                    />
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
                    <Breadcrumb.Item className="item-focus">Ventas</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="container-head-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="title-screen">Ventas</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                    <Button onClick={() => {
                        setSelectedProductId(null);
                        setIsModalVisible(true);
                    }} className='add-button' icon={<ExportOutlined />}>Add Product</Button>
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
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="id"
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                onChange: setCurrentPage,
                            }}
                        />

                    </Content>
                </Layout>
            </Layout>

            <ProductoModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={selectedProductId ? handleEditProducto : handleAddProducto}
            />

            <EditProductoModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onSubmit={handleEditProducto} // Función para enviar los datos editados
                productId={selectedProductId}
            />;

        </div>
    );
};

export default Productos;
