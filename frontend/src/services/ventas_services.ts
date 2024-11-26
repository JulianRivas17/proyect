// services/ventas_services.ts
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

interface Producto {
    id: number;
    nombre: string;
    cantidad: number;
    precio: number;
}


interface VentaData {
    fecha: Dayjs | null;
    productos: Producto[];
    turno: string;
    montoTotal: number;
    estadoPedido: string;
    pago: string;
    facturacion: string;
    nombreCliente: string;
    cajaId: number;
}

const BASE_URL_2 = 'http://localhost:8000/';

export const crearVenta = async (ventaData: VentaData) => {
    try {
        const token = localStorage.getItem('token'); // Obtén el token del localStorage

        const payload = {
            fecha: ventaData.fecha ? ventaData.fecha.format('YYYY-MM-DD') : null,
            hora_venta: dayjs().format('HH:mm:ss'), // Hora actual
            productos: ventaData.productos.map(p => ({
                producto: p.id, // Cambia `p.nombre` a `p.id` para enviar el ID del producto
                cantidad: p.cantidad,
            })),
            turno: ventaData.turno,
            monto_total: ventaData.montoTotal,
            estado_pedido: ventaData.estadoPedido,
            pago: ventaData.pago,
            facturacion: ventaData.facturacion,
            nombre_venta: ventaData.nombreCliente,
            caja_id: ventaData.cajaId
        };

        const response = await axios.post(
            `${BASE_URL_2}ventas/crear-venta/`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data; 
    } catch (error) {
        console.error("Error al crear la venta:", error);
        throw error; 
    }
};

export interface ProductoDisponible {
    id: number;
    nombre_prod: string;
    precio_prod: number;
    image_url: string; 
    category: string;
    description: string;
}

export const obtenerProductos = async (): Promise<ProductoDisponible[]> => {
    try {
       /*  const token = localStorage.getItem('token'); */ 

        const response = await axios.get(`${BASE_URL_2}productos/`, {
    /*         headers: {
                Authorization: `Bearer ${token}`,
            }, */
        });

        return response.data; 
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        throw error;
    }
};

interface VentaResponse {
    id: number;
    fecha: string;
    turno: string;
    monto_total: number;
    estado_pedido: string;
    pago: string;
    facturacion: string;
    productos: { producto: string; cantidad: number, nombre_producto: string, precio_prod: number;  }[];
}

export const obtenerVentas = async (page: number, pageSize: number): Promise<{ results: VentaResponse[]; count: number }> => {
    try {
        const token = localStorage.getItem('token'); // Obtén el token del localStorage

        const response = await axios.get(`${BASE_URL_2}ventas/listar-ventas/`, {
            params: {
                page: page,
                page_size: pageSize,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data; // Devuelve los resultados y el total de elementos
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        throw error;
    }
};


export const eliminarVenta = async (id: number) => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.delete(`${BASE_URL_2}ventas/${id}/eliminar/`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al eliminar la venta:", error);
        throw error;
    }
};

export const obtenerVentaPorId = async (id: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL_2}ventas/${id}/detalle/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener la venta:", error);
        throw error;
    }
};

export const editarVenta = async (id: number, ventaData: any) => {
    console.log("ventada", ventaData)
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${BASE_URL_2}ventas/${id}/detalle/`, ventaData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al editar la venta:", error);
        throw error;
    }
};

