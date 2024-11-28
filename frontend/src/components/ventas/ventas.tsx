import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Table, Breadcrumb, message, Modal, DatePicker, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExportOutlined, MenuOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddVentaModal from './modal/addVentaModal';
import EditVentaModal from './modal/EditVentaModal';
import { obtenerVentas, eliminarVenta } from '../../services/ventas_services';
import { Caja, existenCajasAbiertas, obtenerCajasAbiertas } from '../../services/cajaService';
const { Option } = Select;

const { Sider, Content } = Layout;

interface Producto {
    nombre: string;
    cantidad: number;
}

interface VentaData {
    key: string;
    fecha: string;
    productos: string;
    turno: string;
    montoTotal: number;
}

const Ventas: React.FC = () => {
    const [data, setData] = useState<VentaData[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
    const [estadocajas, setEstadoCajas] = useState<boolean>(false);
    const [sortField, setSortField] = useState<string>(''); // Filtro de ordenación
    const [sortOrder, setSortOrder] = useState<string>('  '); // Orden de la columna
    const [fecha, setFecha] = useState<{ start: string; end: string }[]>([]);
    const [turnoFilter, setTurnoFilter] = useState<string>("");
    const [cajaFilter, setCajaFilter] = useState<string>("");
    const [estadoFilter, setEstadoFilter] = useState<string>("");
    const [key, setKey] = useState(0);
    const [cajasDisponibles, setCajasDisponibles] = useState<Caja[]>([]);

    useEffect(() => {
        fetchVentas(currentPage, pageSize);
        fetchData()
        cargarCajasAbiertas();
    }, [sortOrder, sortField, cajaFilter, turnoFilter, estadoFilter, fecha]);
    
    const fetchVentas = async (page = 1, pageSize = 5) => {
        try {
            const filtros = {
                sortField: sortField,
                sortOrder: sortOrder,
                fecha: fecha.length > 0 ? { start: fecha[0].start, end: fecha[0].end } : undefined, 
                turnoFilter,
                cajaFilter,
                estadoFilter,
            };
            const response = await obtenerVentas(page, pageSize, filtros);
            const ventasData = response.results
                .filter((venta) => venta && venta.fecha) // Filtra ventas válidas
                .map((venta) => ({
                    key: venta.id?.toString() || '', // Si `venta.id` es undefined, usa un string vacío
                    fecha: dayjs(venta.fecha).format('DD/MM/YYYY'),
                    productos: (venta.productos || [])
                        .map((p) => `${p.nombre_producto || 'Producto desconocido'} (x${p.cantidad || 0})`)
                        .join(', '),
                    turno: venta.turno || 'Sin turno',
                    montoTotal: venta.monto_total || 0,
                    estado_pedido: venta.estado_pedido || "",
                    pago: venta.pago || "",
                    facturacion: venta.facturacion || ""
                }));
            setData(ventasData);
            setTotal(response.count);
            setCurrentPage(page);
            setPageSize(pageSize);
            console.log("data", data)
        } catch (error) {
            message.error("Error al cargar las ventas");
            console.error("Error al cargar las ventas:", error);
        }
    };

    const fetchData = async () => {
        try {
            const estado: boolean = await existenCajasAbiertas();
            setEstadoCajas(estado);
        } catch (error) {
            console.error("Error al obtener el estado de cajas abiertas:", error);
        }
    };

    const cargarCajasAbiertas = async () => {
        try {
            const cajas = await obtenerCajasAbiertas();
            setCajasDisponibles(cajas); 
        } catch (error) {
            console.error('Error al obtener las cajas abiertas:', error);
        }
    };
    
    const handlePageChange = (page: number, pageSize?: number) => {
        fetchVentas(page, pageSize || 5);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSave = async (fecha: dayjs.Dayjs | null, productos: Producto[], turno: string, montoTotal: number) => {
        try {
            const newVenta = {
                key: (data.length + 1).toString(),
                fecha: fecha ? fecha.format('DD/MM/YYYY') : '',
                productos: productos.map((p) => `${p.nombre} (x${p.cantidad})`).join(', '),
                turno,
                montoTotal,
            };
            fetchVentas(currentPage, pageSize);
            message.success('Venta creada exitosamente');
            setIsModalVisible(false);
        } catch (error) {
            message.error('Error al crear la venta');
        }
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: '¿Estás seguro de que quieres eliminar esta venta?',
            content: 'Esta acción no se puede deshacer.',
            onOk: async () => {
                try {
                    await eliminarVenta(id);
                    message.success('Venta eliminada exitosamente');
                    fetchVentas(currentPage, pageSize);
                } catch (error) {
                    message.error('Error al eliminar la venta');
                }
            },
            onCancel: () => {
                console.log('Eliminación cancelada');
            }
        });
    };

    const handleEdit = (venta: VentaData) => {
        setVentaSeleccionada(venta);
        setIsEditModalVisible(true);
        fetchVentas(currentPage, pageSize);
    };

    const estadoPedidoOptions: { [key in 'ENESPERA' | 'ENPROCESO' | 'ENTREGADO']: string } = {
        'ENESPERA': 'En espera',
        'ENPROCESO': 'En proceso',
        'ENTREGADO': 'Entregado',
    };

    const pagoOptions: { [key in 'PAGADO' | 'NOPAGADO']: string } = {
        'PAGADO': 'Pagado',
        'NOPAGADO': 'No pagado',
    };

    const facturacionOptions: { [key in 'NOFACTURADO' | 'FACTURADO']: string } = {
        'NOFACTURADO': 'No facturado',
        'FACTURADO': 'Facturado',
    };

    const handleTableChange = (field: string) => {
        const newSortOrder = sortOrder === 'ascend' ? 'descend' : 'ascend';
        console.log('Nuevo sortOrder:', newSortOrder);
        setFecha([])
        setSortField(field);
        setSortOrder(newSortOrder);
        fetchVentas();
    };
    const columns = [
        {
            title: 'Fecha', dataIndex: 'fecha', key: 'fecha', sorter: true,
            onHeaderCell: () => ({
                onClick: () => handleTableChange('fecha'),
            }),
        },
        { title: 'Productos', dataIndex: 'productos', key: 'productos' },
        {
            title: 'Monto Total (AR$)', dataIndex: 'montoTotal', key: 'montoTotal', render: (monto: any) => `$ ${Number(monto || 0).toFixed(2)}`, sorter: true,
            onHeaderCell: () => ({
                onClick: () => handleTableChange('monto_total'),
            }),
        },
        {
            title: 'Turno', dataIndex: 'turno', key: 'turno', sorter: true,
            onHeaderCell: () => ({
                onClick: () => handleTableChange('turno'),
            }),
        },
        {
            title: 'Estado de producto',
            dataIndex: 'estado_pedido',
            key: 'estado_pedido',
            render: (text: keyof typeof estadoPedidoOptions) => estadoPedidoOptions[text] || text,
            sorter: true,
            onHeaderCell: () => ({
                onClick: () => handleTableChange('estado_pedido'),
            }),
        },
        {
            title: 'Estado de pago',
            dataIndex: 'pago',
            key: 'pago',
            render: (text: keyof typeof pagoOptions) => pagoOptions[text] || text,
            sorter: true,
            onHeaderCell: () => ({
                onClick: () => handleTableChange('pago'),
            }),
        },
        {
            title: 'Estado de facturación',
            dataIndex: 'facturacion',
            key: 'facturacion',
            render: (text: keyof typeof facturacionOptions) => facturacionOptions[text] || text,
            sorter: true,
            onHeaderCell: () => ({
                onClick: () => handleTableChange('facturacion'),
            }),
        },
        {
            title: 'Opciones', key: 'opciones', render: (_: any, record: any) => (
                <span>
                    <Button icon={<EditOutlined />} type="link" onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} type="link" danger onClick={() => handleDelete(record.key)} />
                </span>
            ),
        },
    ];

    const handleRowSelection = (selectedKeys: React.Key[]) => {
        setSelectedRowKeys(selectedKeys as number[]);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: handleRowSelection,
    };

    const handleDateChange = (dates: any, dateStrings: [string, string]) => {
        if (dateStrings[0] && dateStrings[1]) {
            const newFilter = { start: dateStrings[0], end: dateStrings[1] };
            setFecha([newFilter]);
        }
    };

    const handleClearFilter = () => {
        setCajaFilter("");
        setEstadoFilter("");
        setCajaFilter("");
        setTurnoFilter("")
        setFecha([])
        setKey(key + 1); 
      };

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
                    <Button className='add-button' icon={<ExportOutlined />}>Exportar Data</Button>
                    <Button disabled={!estadocajas} className='add-button' type="primary" icon={<PlusOutlined />} onClick={showModal}>Añadir Venta</Button>
                </div>
            </div>

            <Layout style={{ minHeight: '65vh', overflow: 'hidden' }}>
                <Sider width={250} className="sider">
                    <Card title="Filtros" bordered={false} className="filters-card">
                        <DatePicker.RangePicker onChange={handleDateChange} key={key} />
                        <div style={{ marginTop: "15px" }}>
                            <Select
                                placeholder="Elige un estado de pedido"
                                style={{ width: '100%' }}
                                value={estadoFilter}
                                onChange={(value) => setEstadoFilter(value)}
                            >
                                <Option value="">Todos</Option>
                                <Option value="ENESPERA">En espera</Option>
                                <Option value="ENPROCESO">En proceso</Option>
                                <Option value="ENTREGADO">Entregado</Option>
                            </Select>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <Select
                                placeholder="Elige un turno"
                                style={{ width: '100%' }}
                                value={turnoFilter}
                                onChange={(value) => setTurnoFilter(value)}
                            >   
                                <Option value="">Todos</Option>
                                <Option value="Mañana">Mañana</Option>
                                <Option value="Noche">Noche</Option>
                            </Select>
                        </div>
                        <div style={{ marginTop: "15px" }}>
                            <Select
                                placeholder="Selecciona una caja"
                                style={{ width: '100%' }}
                                value={cajaFilter}
                                onChange={(value) => setCajaFilter(value)} // Guardamos el id de la caja seleccionada
                            >
                                {cajasDisponibles.map((caja) => (
                                    <Option key={caja.id} value={caja.id}>
                                        {caja.nombre}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <Button style={{ marginTop: "20px" }} type="primary" className="clear-filters-button" onClick={() => handleClearFilter()}>Limpiar filtros</Button>
                    </Card>
                </Sider>

                <Layout className="layout-content">
                    <Content style={{ padding: '0px 20px', marginTop: '-20px' }}>
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={data}
                            rowKey="key"
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                onChange: handlePageChange,
                                showSizeChanger: true,
                                pageSizeOptions: ['5', '10', '20', '50', '100'],
                                total: total,
                            }}
                        />
                    </Content>
                </Layout>
            </Layout>

            <AddVentaModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSave={handleSave}
            />

            {ventaSeleccionada && (
                <EditVentaModal
                    ventaId={parseInt(ventaSeleccionada.key, 10)}
                    onEditComplete={() => {
                        fetchVentas(currentPage, pageSize);
                        setVentaSeleccionada(null); // Limpia la selección tras la edición
                    }}
                />
            )}

        </div>
    );
};

export default Ventas;
