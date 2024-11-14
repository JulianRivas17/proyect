import axios from 'axios';
import { ProductoDisponible } from './ventas_services';

const BASE_URL = 'http://localhost:8000';

// Crear una instancia de Axios
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Interceptor para agregar el token a todas las solicitudes
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Suponiendo que el token está almacenado en localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Servicios
export const obtenerProductos = async (): Promise<ProductoDisponible[]> => {
    try {
        const response = await axiosInstance.get('/productos/productos/');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        throw error;
    }
};

export const obtenerProductoPorId = async (productId: number): Promise<ProductoDisponible> => {
    try {
        const response = await axiosInstance.get(`/productos/productos/${productId}/`);
        return response.data;
    } catch (error) {
        console.error('Error al cargar los datos del producto:', error);
        throw error;
    }
};

export const agregarProducto = async (formData: FormData): Promise<ProductoDisponible> => {
    try {
        const response = await axiosInstance.post('/productos/productos/add/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        throw error;
    }
};

export const editarProducto = async (id: number, formData: FormData): Promise<ProductoDisponible> => {
    try {
        const response = await axiosInstance.put(`/productos/productos/${id}/edit/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error('Error al editar el producto:', error);
        throw error;
    }
};

export const eliminarProducto = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/productos/productos/delete/${id}/`);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        throw error;
    }
};

export const obtenerURLImagen = (rutaRelativa: string | null): string | null => {
    if (!rutaRelativa) return null;
    return `${BASE_URL}${rutaRelativa}`;
};

