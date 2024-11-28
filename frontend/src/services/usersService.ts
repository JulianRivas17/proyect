import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Cambia esto por tu URL base

export const listarUsuarios = async (email: string = '', sortField: string = '', sortOrder: string = '') => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
        const response = await axios.get(`${BASE_URL}/usuarios/listar-usuarios/`, {
            headers,
            params: {
                email,
                sortField,
                sortOrder
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerRoles = async (): Promise<any[]> => {
    try {
        const token = localStorage.getItem('token'); // Asegúrate de que el token está en el localStorage
        const response = await axios.get(`${BASE_URL}/roles/listar-grupos/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Asumimos que el backend devuelve un array de strings con los roles
    } catch (error) {
        console.error('Error al obtener los roles:', error);
        throw error;
    }
};

export const crearUsuario = async (usuarioData: any): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${BASE_URL}/usuarios/crear-usuario/`, usuarioData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

export const obtenerUsuarioPorId = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/usuarios/obtener-usuario/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const actualizarUsuario = async (id: number, userData: any) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}/usuarios/editar-usuario/${id}/`, userData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const eliminarUsuario = async (userId: any) => {
    const token = localStorage.getItem('token');
    try {
        await axios.delete(`${BASE_URL}/usuarios/eliminar-usuario/${userId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        throw error;
    }
};