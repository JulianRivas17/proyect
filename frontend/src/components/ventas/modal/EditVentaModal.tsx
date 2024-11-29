import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, DatePicker, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { obtenerProductos, obtenerVentaPorId, editarVenta } from '../../../services/ventas_services';
import dayjs, { Dayjs } from 'dayjs';
import { Caja, obtenerCajasAbiertas } from '../../../services/cajaService';
import './modal-styles.css'

const { Option } = Select;

interface Producto {
    id: number;
    nombre: string;
    cantidad: number;
    precio: number;
}

interface ProductoDisponible {
    id: number;
    nombre_prod: string;
    precio_prod: number;
}

interface EditVentaModalProps {
    ventaId: number;
    onEditComplete: () => void;
}

const EditVentaModal: React.FC<EditVentaModalProps> = ({ ventaId, onEditComplete }) => {
    const [visible, setVisible] = useState<boolean>(true);
    const [fecha, setFecha] = useState<Dayjs | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [turno, setTurno] = useState<string>('');
    const [estadoPedido, setEstadoPedido] = useState<string>(''); // Nuevo estado
    const [pago, setPago] = useState<string>(''); // Nuevo estado
    const [facturacion, setFacturacion] = useState<string>(''); // Nuevo estado
    const [tipoPago, setTipoPago] = useState<string>(''); // Nuevo estado
    const [montoTotal, setMontoTotal] = useState<number>(0);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [productosDisponibles, setProductosDisponibles] = useState<ProductoDisponible[]>([]);
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [cajasDisponibles, setCajasDisponibles] = useState<Caja[]>([]); // Estado para las cajas disponibles
    const [selectedCajaId, setSelectedCajaId] = useState<number | null>(null);
    useEffect(() => {
        cargarVenta(ventaId);
        cargarProductos();
        cargarCajasAbiertas();
    }, [ventaId]);

    const closeModal = () => {
        setVisible(false);
        onEditComplete();
    };

    const cargarCajasAbiertas = async () => {
        try {
            const cajas = await obtenerCajasAbiertas();
            setCajasDisponibles(cajas); // Guardar las cajas abiertas en el estado
        } catch (error) {
            console.error('Error al obtener las cajas abiertas:', error);
        }
    };

    const cargarVenta = async (id: number) => {
        try {
            const venta = await obtenerVentaPorId(id);
            setFecha(dayjs(venta.fecha));
            setTurno(venta.turno);
            setEstadoPedido(venta.estado_pedido);  // Cargar el estado del pedido
            setPago(venta.pago);  // Cargar el estado de pago
            setFacturacion(venta.facturacion);  // Cargar el estado de facturación
            setTipoPago(venta.tipo_pago);  // Cargar el estado de facturación
            setNombreCliente(venta.nombre_venta)
            const productosConPrecio: Producto[] = venta.productos.map((prod: any) => {
                return {
                    id: prod.producto,
                    nombre: prod.nombre_producto,
                    cantidad: prod.cantidad,
                    precio: prod.precio_producto,
                };
            });
            setProductos(productosConPrecio);
            setSelectedCajaId(venta.caja_id)
            const total = productosConPrecio.reduce((acc: number, prod: Producto) => acc + prod.precio * prod.cantidad, 0);
            setMontoTotal(total);

        } catch (error) {
            message.error("Error al cargar la venta");
        }
    };

    const cargarProductos = async () => {
        try {
            const filtros = {}
            const productos = await obtenerProductos(filtros);
            setProductosDisponibles(productos);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };

    const handleAddProduct = () => {
        if (selectedProductId && selectedQuantity > 0) {
            const productoSeleccionado = productosDisponibles.find(prod => prod.id === selectedProductId);
            if (productoSeleccionado) {
                const newProducto: Producto = {
                    id: productoSeleccionado.id,
                    nombre: productoSeleccionado.nombre_prod,
                    cantidad: selectedQuantity,
                    precio: productoSeleccionado.precio_prod,
                };
                setProductos([...productos, newProducto]);
                setMontoTotal(montoTotal + (productoSeleccionado.precio_prod * selectedQuantity));
                setSelectedProductId(null);
                setSelectedQuantity(1);
            }
        }
    };

    const handleRemoveProduct = (productId: number) => {
        const productoParaRemover = productos.find(p => p.id === productId);
        if (productoParaRemover) {
            setProductos(productos.filter(p => p.id !== productId));
            setMontoTotal(montoTotal - (productoParaRemover.precio * productoParaRemover.cantidad));
        }
    };

    const handleSave = async () => {
        const ventaData = {
            fecha: fecha ? fecha.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
            productos: productos.map((prod) => ({
                producto: prod.id,
                cantidad: prod.cantidad
            })),
            turno,
            monto_total: montoTotal,
            estado_pedido: estadoPedido,
            pago,
            facturacion,
            tipo_pago: tipoPago,
            nombre_venta: nombreCliente,
            caja_id: selectedCajaId
        };

        try {
            await editarVenta(ventaId, ventaData);
            closeModal();
        } catch (error) {
            message.error("Error al editar la venta");
        }
    };


    return (
        <Modal
            title="Editar Venta"
            visible={visible}
            onCancel={closeModal}
            onOk={handleSave}
            okText="Guardar cambios"
            cancelText="Cancelar"
            destroyOnClose={true}
        >
            <div>
                <label>Fecha*</label>
                <DatePicker
                    value={fecha}
                    onChange={(date) => setFecha(date)}
                    style={{ width: '100%' }}
                    disabled
                />
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Productos*</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                <Select
                        placeholder="Elige un producto"
                        style={{ width: '60%' }}
                        value={selectedProductId}
                        onChange={(value) => setSelectedProductId(value as number)}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ? option.label.toString().toLowerCase() : '').includes(input.toLowerCase())
                        }
                    >
                        {productosDisponibles.map((producto) => (
                            <Option key={producto.id} value={producto.id} label={producto.nombre_prod}>
                                {producto.nombre_prod}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        type="number"
                        min={1}
                        placeholder="Cantidad"
                        style={{ width: '30%' }}
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
                    />
                    <Button 
                        style={{borderColor: "#51971A", backgroundColor: "#51971A"}}
                        type="primary" 
                        onClick={handleAddProduct}
                    >
                        Añadir producto
                    </Button>
                </div>

                <div style={{ marginTop: '10px' }}>
                    {productos.map((producto, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                            <span>{producto.nombre} (x{producto.cantidad})</span>
                            <Button
                                type="link"
                                icon={<CloseOutlined />}
                                onClick={() => handleRemoveProduct(producto.id)}
                                danger
                            />
                        </div>
                    ))}
                </div>
            </div>
           
            <div className="flex"> 
                <div style={{ marginTop: '1rem', width: "100%" }}>
                    <label>Nombre Cliente*</label>
                    <Input
                        type="text"
                        placeholder="Ingresa el nombre del cliente"
                        style={{ width: '100%' }}
                        value={nombreCliente}
                        onChange={(e) => setNombreCliente(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: '1rem', width: "100%" }}>
                    <label>Turno*</label>
                    <Select
                        placeholder="Elige un turno"
                        style={{ width: '100%' }}
                        value={turno}
                        onChange={(value) => setTurno(value)}
                    >
                        <Option value="Mañana">Mañana</Option>
                        <Option value="Tarde">Tarde</Option>
                        <Option value="Noche">Noche</Option>
                    </Select>
                </div>  
            </div>

            <div className="flex"> 
                <div style={{ marginTop: '1rem', width: "100%" }}>
                    <label>Estado de Pedido*</label>
                    <Select
                        placeholder="Elige un estado"
                        style={{ width: '100%' }}
                        value={estadoPedido}
                        onChange={(value) => setEstadoPedido(value)}
                    >
                        <Option value="ENESPERA">En espera</Option>
                        <Option value="ENPROCESO">En progreso</Option>
                        <Option value="ENTREGADO">Entregado</Option>
                        <Option value="LISTO">Listo para entrega</Option>
                    </Select>
                </div>
                <div style={{ marginTop: '1rem', width: '100%' }}>
                    <label>Estado de Pago*</label>
                    <Select
                        placeholder="Elige un estado"
                        style={{ width: '100%' }}
                        value={pago}
                        onChange={(value) => setPago(value)}
                    >
                        <Option value="PAGADO">Pagado</Option>
                        <Option value="NOPAGADO">No pagado</Option>
                    </Select>
                </div>
            </div>


            <div className="flex"> 
                <div style={{ marginTop: '1rem', width: "100%" }}>
                    <label>Estado de Facturación*</label>
                    <Select
                        placeholder="Elige un estado"
                        style={{ width: '100%' }}
                        value={facturacion}
                        onChange={(value) => setFacturacion(value)}
                    >
                        {pago === "PAGADO" ? (
                            <>
                            <Option value="FACTURADO">Facturado</Option>
                            <Option value="NOFACTURADO">No Facturado</Option>
                            </>
                        ) : (
                            <Option value="NOFACTURADO">No Facturado</Option>
                        )}
                    </Select>
                </div>
                <div style={{ marginTop: '1rem',width: "100%" }}>
                    <label>Tipo de Pago*</label>
                    <Select
                        placeholder="Elige un estado"
                        style={{ width: '100%' }}
                        value={tipoPago}
                        onChange={(value) => setTipoPago(value)}
                    >
                        <Option value="EFECTIVO">Efectivo</Option>
                        <Option value="TARJETA">Tarjeta</Option>
                    </Select>
                </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Seleccionar Caja*</label>
                <Select
                    placeholder="Selecciona una caja"
                    style={{ width: '100%' }}
                    value={selectedCajaId}
                    onChange={(value) => setSelectedCajaId(value as number)}
                >
                    {cajasDisponibles.map((caja) => (
                        <Option key={caja.id} value={caja.id}>
                            {caja.nombre}
                        </Option>
                    ))}
                </Select>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Monto total</label>
                <Input
                    type="text"
                    placeholder="Monto total"
                    value={`$ ${(montoTotal || 0).toFixed(2)}`}
                    readOnly
                    disabled
                />
            </div>
        </Modal>
    );
};

export default EditVentaModal;
