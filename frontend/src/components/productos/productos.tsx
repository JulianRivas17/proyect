import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Table, Breadcrumb, message, Modal, Input, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, MenuOutlined, ExportOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { obtenerProductos, ProductoDisponible } from '../../services/ventas_services';
import { agregarProducto, editarProducto, eliminarProducto, obtenerURLImagen } from '../../services/productosService';
import ProductoModal from './modal/add-productos-model';
import EditProductoModal from './modal/edit-productos-model';

const { Sider, Content } = Layout;
const { Option } = Select;

const Productos: React.FC = () => {
    const [data, setData] = useState<ProductoDisponible[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [nombreFilter, setNombreFilter] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState<string | undefined>(undefined);
    const [sortField, setSortField] = useState<string | undefined>('');  // Estado para el campo de ordenación
    const [sortOrder, setSortOrder] = useState<string | undefined>('');

    const fetchProductos = async () => {
        try {
          const filtros: any = { 
            nombre: nombreFilter.trim(), 
            categoria: categoriaFilter 
          };
    
          if (sortField && sortOrder) {
            filtros.sortField = sortField;
            filtros.sortOrder = sortOrder === 'ascend' ? 'asc' : 'desc';  
          }
          
          const productos = await obtenerProductos(filtros);
          setData(productos);
        } catch (error) {
          message.error('Error al cargar los productos');
        }
      };

    useEffect(() => {
        fetchProductos();
    }, [nombreFilter, categoriaFilter, sortField, sortOrder]);

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

    const handleClearFilters = () => {
        setNombreFilter('');
        setCategoriaFilter(undefined);
    };

    const handleSort = (sorter: { field: string; order: string }) => {
        setSortField(sorter.field);  // Almacenar el campo de ordenación
        setSortOrder(sorter.order);  // Almacenar la dirección de ordenación
      };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre_prod',
            key: 'nombre_prod',
            sorter: true,
            onHeaderCell: () => ({
              onClick: () => handleSort({ field: 'nombre_prod', order: sortOrder === 'ascend' ? 'descend' : 'ascend' }),  // Llamar a la función de ordenación
            }),
          },
          {
            title: 'Precio',
            dataIndex: 'precio_prod',
            key: 'precio_prod',
            sorter: true,
            onHeaderCell: () => ({
              onClick: () => handleSort({ field: 'precio_prod', order: sortOrder === 'ascend' ? 'descend' : 'ascend' }),  // Llamar a la función de ordenación
            }),
          },
          {
            title: 'Categoría',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
            onHeaderCell: () => ({
              onClick: () => handleSort({ field: 'category', order: sortOrder === 'ascend' ? 'descend' : 'ascend' }),  // Llamar a la función de ordenación
            }),
          },
          {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
            sorter: true,
            onHeaderCell: () => ({
              onClick: () => handleSort({ field: 'description', order: sortOrder === 'ascend' ? 'descend' : 'ascend' }),  // Llamar a la función de ordenación
            }),
          },
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

    // Filtrar los productos según el nombre y la categoría
    const filteredData = data.filter(producto => {
        const matchesNombre = nombreFilter.trim() ? producto.nombre_prod.toLowerCase().includes(nombreFilter.toLowerCase()) : true;
        const matchesCategoria = categoriaFilter ? producto.category === categoriaFilter : true;
        return matchesNombre && matchesCategoria;
    });

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
                        <div style={{ marginBottom: '16px' }}>
                            <Input
                                placeholder="Buscar por nombre"
                                value={nombreFilter}
                                onChange={e => setNombreFilter(e.target.value)}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Select
                                placeholder="Seleccionar categoría"
                                value={categoriaFilter}
                                onChange={value => setCategoriaFilter(value)}
                                style={{ width: '100%' }}
                            >
                                <Option value="ESPECIALIDADES">Especialidades</Option>
                                <Option value="BEBIDAS">Bebidas</Option>
                                <Option value="PRINCIPALES">Principales</Option>
                                <Option value="POSTRES">Postres</Option>
                            </Select>
                        </div>
                        <Button type="primary" className="clear-filters-button" onClick={handleClearFilters}>Limpiar filtros</Button>
                    </Card>
                </Sider>

                <Layout className="layout-content">
                    <Content style={{ padding: '0px 20px', marginTop: '-20px' }}>
                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            rowKey="id"
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
                onSubmit={handleEditProducto}
                productId={selectedProductId}
            />
        </div>
    );
};

export default Productos;
