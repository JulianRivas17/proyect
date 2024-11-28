// services/ventas_services.ts
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';

interface Producto {
    id: number;
    nombre: string;
    cantidad: number;
    precio: number;
}


export interface VentaData {
    fecha: Dayjs | null;
    productos: Producto[];
    turno: string;
    montoTotal: number;
    estadoPedido: string;
    pago: string;
    facturacion: string;
    nombreCliente: string;
    cajaId: number | null;
}

const BASE_URL_2 = 'http://localhost:8000/';

export const crearVenta = async (ventaData: VentaData) => {
    try {
        // Generar el payload para la solicitud
        const payload = {
            fecha: ventaData.fecha ? ventaData.fecha.format('YYYY-MM-DD') : null,
            hora_venta: dayjs().format('HH:mm:ss'), // Hora actual
            productos: ventaData.productos.map(p => ({
                producto: p.id, // ID del producto
                cantidad: p.cantidad,
            })),
            turno: ventaData.turno,
            monto_total: ventaData.montoTotal,
            estado_pedido: ventaData.estadoPedido,
            pago: ventaData.pago,
            facturacion: ventaData.facturacion,
            nombre_venta: ventaData.nombreCliente,
            caja_id: ventaData.cajaId,
        };

        // No enviar encabezados si no es necesario
        const response = await axios.post(
            `${BASE_URL_2}ventas/crear-venta/`,
            payload
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

export const obtenerProductos = async (filtros: { categoria?: string, nombre?: string, sortField?: string, sortOrder?: string }): Promise<ProductoDisponible[]> => {
    try {
        const params: any = {};

        if (filtros.categoria) {
            params.categoria = filtros.categoria;
        }

        if (filtros.nombre) {
            params.nombre = filtros.nombre;
        }

        if (filtros.sortField) {
            params.sortField = filtros.sortField;
            params.sortOrder = filtros.sortOrder;  // Incluimos el orden de la columna
        }

        const response = await axios.get(`${BASE_URL_2}productos/`, {
            params,
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
    productos: { producto: string; cantidad: number, nombre_producto: string, precio_prod: number; }[];
}

export const obtenerVentas = async (
    page: number,
    pageSize: number,
    filtros: { 
        sortField?: string, 
        sortOrder?: string,
        fecha?: { start: string, end: string }, 
        turnoFilter?: string,
        cajaFilter?: string,
        estadoFilter?: string 
    } = {}  // Establece un valor por defecto vacío para filtros
): Promise<{ results: VentaResponse[]; count: number }> => {
    console.log(filtros, "los filtros");
    try {
        const params: any = {
            page,
            page_size: pageSize,
        };

        // Agrega los parámetros de ordenación solo si existen en 'filtros'
        if (filtros.sortField && filtros.sortOrder) {
            params.sortField = filtros.sortField;
            params.sortOrder = filtros.sortOrder;
        }

        // Filtra por fecha si se proporciona
        if (filtros.fecha && filtros.fecha.start && filtros.fecha.end) {
            params.fecha_inicio = filtros.fecha.start;
            params.fecha_fin = filtros.fecha.end;
        }

        // Agrega filtros adicionales
        if (filtros.turnoFilter) {
            params.turno = filtros.turnoFilter;
        }
        if (filtros.cajaFilter) {
            params.caja_id = filtros.cajaFilter;
        }
        if (filtros.estadoFilter) {
            params.estado_pedido = filtros.estadoFilter;
        }

        const token = localStorage.getItem('token');

        const response = await axios.get(`${BASE_URL_2}ventas/listar-ventas/`, {
            params,
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

