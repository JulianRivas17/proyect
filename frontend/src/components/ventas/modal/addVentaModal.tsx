import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, DatePicker, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { obtenerProductos, crearVenta } from '../../../services/ventas_services';
import { Caja, obtenerCajasAbiertas } from '../../../services/cajaService';

const { Option } = Select;

interface Producto {
    id: number; // Añadir el ID del producto
    nombre: string;
    cantidad: number;
    precio: number;
}

interface ProductoDisponible {
    id: number;
    nombre_prod: string;
    precio_prod: number;
}

interface AddVentaModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (fecha: Dayjs | null, productos: Producto[], turno: string, montoTotal: number, estadoPedido: string, pago: string, facturacion: string, nombreCliente: string, selectedCajaId: number | null) => void;
}

const AddVentaModal: React.FC<AddVentaModalProps> = ({ visible, onCancel, onSave }) => {
    const [fecha] = useState<Dayjs>(dayjs());
    const [productos, setProductos] = useState<Producto[]>([]);
    const [turno, setTurno] = useState<string>('');
    const [facturacion, setFacturacion] = useState<string>('');
    const [pago, setPago] = useState<string>('');
    const [estadoPedido, setEstadoPedido] = useState<string>('');
    const [montoTotal, setMontoTotal] = useState<number>(0);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null); // Cambia a ID
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [productosDisponibles, setProductosDisponibles] = useState<ProductoDisponible[]>([]);
    const [nombreCliente, setNombreCliente] = useState<string>("");
    const [cajasDisponibles, setCajasDisponibles] = useState<Caja[]>([]);
    const [selectedCajaId, setSelectedCajaId] = useState<number | null>(null);

    useEffect(() => {
        if (visible) {
            resetForm();
            cargarProductos();
            cargarCajasAbiertas();
        }
    }, [visible]);


    const resetForm = () => {
        setProductos([]);
        setTurno('');
        setMontoTotal(0);
        setSelectedProductId(null);
        setEstadoPedido("");
        setPago("");
        setFacturacion("");
        setNombreCliente("")
        setSelectedCajaId(null);
        setSelectedQuantity(1);
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

    const cargarCajasAbiertas = async () => {
        try {
            const cajas = await obtenerCajasAbiertas();
            setCajasDisponibles(cajas); // Guardar las cajas abiertas en el estado
        } catch (error) {
            console.error('Error al obtener las cajas abiertas:', error);
        }
    };

    const handleAddProduct = () => {
        if (selectedProductId && selectedQuantity > 0) {
            const productoSeleccionado = productosDisponibles.find(prod => prod.id === selectedProductId);

            if (productoSeleccionado) {
                const newProducto: Producto = {
                    id: productoSeleccionado.id, // Usa el ID del producto
                    nombre: productoSeleccionado.nombre_prod,
                    cantidad: selectedQuantity,
                    precio: productoSeleccionado.precio_prod,
                };

                const newProductos = [...productos, newProducto];
                const newMontoTotal = montoTotal + (productoSeleccionado.precio_prod * selectedQuantity);

                setProductos(newProductos);
                setMontoTotal(newMontoTotal);

                setSelectedProductId(null);
                setSelectedQuantity(1);
            }
        }
    };

    const handleRemoveProduct = (productId: number) => {
        const productoParaRemover = productos.find((p) => p.id === productId);

        if (productoParaRemover) {
            const updatedProductos = productos.filter((p) => p.id !== productId);
            const newMontoTotal = montoTotal - (productoParaRemover.precio * productoParaRemover.cantidad);

            setProductos(updatedProductos);
            setMontoTotal(newMontoTotal);
        }
    };

    const handleSave = async () => {
        const ventaData = {
            fecha,
            productos,
            turno,
            montoTotal,
            estadoPedido,
            pago,
            facturacion,
            nombreCliente,
            cajaId: selectedCajaId || 1,
        };

        try {
            await crearVenta(ventaData);
            onSave(fecha, productos, turno, montoTotal, facturacion, pago, estadoPedido, nombreCliente, selectedCajaId);
            onCancel();  // Cierra el modal
        } catch (error) {
            message.error("Error al crear la venta. Intenta nuevamente.");
            console.error("Error al crear la venta:", error);
        }
    };
    return (
        <Modal
            title="Añadir Venta"
            visible={visible}
            onCancel={onCancel}
            onOk={handleSave}
            okText="Guardar cambios"
            cancelText="Cancelar"
        >
            <div>
                <label>Fecha*</label>
                <DatePicker
                    style={{ width: '100%' }}
                    value={fecha}
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
                    <Button type="primary" onClick={handleAddProduct}>Añadir producto</Button>
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
            <div style={{ marginTop: '1rem' }}>
                <label>Nombre Cliente*</label>
                <Input
                    type="text"
                    placeholder="Ingresa el nombre del cliente"
                    style={{ width: '100%' }}
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)} // Guardar el valor en el estado
                />
            </div>
            <div style={{ marginTop: '1rem' }}>
                <label>Turno*</label>
                <Select
                    placeholder="Elige un turno"
                    style={{ width: '100%' }}
                    value={turno}
                    onChange={(value) => setTurno(value)}
                >
                    <Option value="Mañana">Mañana</Option>
                    <Option value="Noche">Noche</Option>
                </Select>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Estado Pedido*</label>
                <Select
                    placeholder="Elige un turno"
                    style={{ width: '100%' }}
                    value={estadoPedido}
                    onChange={(value) => setEstadoPedido(value)}
                >
                    <Option value="ENESPERA">En espera</Option>
                    <Option value="ENPROCESO">En proceso</Option>
                    <Option value="ENTREGADO">Entregado</Option>
                </Select>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Pago*</label>
                <Select
                    placeholder="Elige un turno"
                    style={{ width: '100%' }}
                    value={pago}
                    onChange={(value) => setPago(value)}
                >
                    <Option value="PAGADO">Pagado</Option>
                    <Option value="NOPAGADO">No pagado</Option>
                </Select>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Facturación*</label>
                <Select
                    placeholder="Elige un turno"
                    style={{ width: '100%' }}
                    value={facturacion}
                    onChange={(value) => setFacturacion(value)}
                >
                    <Option value="NOFACTURADO">No facturado</Option>
                    <Option value="FACTURADO">Facturado</Option>
                </Select>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <label>Seleccionar Caja*</label>
                <Select
                    placeholder="Selecciona una caja"
                    style={{ width: '100%' }}
                    value={selectedCajaId}
                    onChange={(value) => setSelectedCajaId(value as number)} // Guardamos el id de la caja seleccionada
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
                    value={`$ ${montoTotal.toFixed(2)}`}
                    readOnly
                    disabled
                />
            </div>
        </Modal>
    );
};

export default AddVentaModal;

