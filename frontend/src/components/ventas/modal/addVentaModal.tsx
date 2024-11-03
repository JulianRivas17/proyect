import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, DatePicker, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { obtenerProductos, crearVenta } from '../../../services/ventas_services';

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
    onSave: (fecha: Dayjs | null, productos: Producto[], turno: string, montoTotal: number) => void;
}

const AddVentaModal: React.FC<AddVentaModalProps> = ({ visible, onCancel, onSave }) => {
    const [fecha, setFecha] = useState<Dayjs | null>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [turno, setTurno] = useState<string>('');
    const [montoTotal, setMontoTotal] = useState<number>(0);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null); // Cambia a ID
    const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
    const [productosDisponibles, setProductosDisponibles] = useState<ProductoDisponible[]>([]);

    useEffect(() => {
        if (visible) {
            cargarProductos();
        }
    }, [visible]);

    const cargarProductos = async () => {
        try {
            const productos = await obtenerProductos();
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
                    id: productoSeleccionado.id, // Usa el ID del producto
                    nombre: productoSeleccionado.nombre_prod,
                    cantidad: selectedQuantity,
                    precio: productoSeleccionado.precio_prod,
                };

                const newProductos = [...productos, newProducto];
                const newMontoTotal = montoTotal + (productoSeleccionado.precio_prod * selectedQuantity);
                
                setProductos(newProductos);
                setMontoTotal(newMontoTotal);

                setSelectedProductId(null); // Resetear el producto seleccionado
                setSelectedQuantity(1);   // Resetear la cantidad seleccionada
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
        };

        try {
            await crearVenta(ventaData);
            message.success("Venta creada con éxito");
            onSave(fecha, productos, turno, montoTotal);  // Actualiza el estado principal
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
                    onChange={(date) => setFecha(date)}
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
                    >
                        {productosDisponibles.map((producto) => (
                            <Option key={producto.id} value={producto.id}>
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
                <label>Turno*</label>
                <Select
                    placeholder="Elige un turno"
                    style={{ width: '100%' }}
                    onChange={(value) => setTurno(value)}
                >
                    <Option value="Mañana">Mañana</Option>
                    <Option value="Tarde">Tarde</Option>
                    <Option value="Noche">Noche</Option>
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
function resetForm() {
    throw new Error('Function not implemented.');
}

