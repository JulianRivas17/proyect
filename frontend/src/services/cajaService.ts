import axios from 'axios';

// Define la URL base de tu API
const BASE_URL = 'http://localhost:8000/caja/';

// Interface para representar los datos de la caja
export interface CajaData {
    id: number;
    id_empleado: number;
    estado_caja: boolean;
    fecha_hs_aper_caja: string;
    fecha_hs_cierre_caja: string | null;
    monto_inicial_caja: string;
    total_saldo_caja: string | null;
}

// Función para obtener la lista de cajas
export const listarCajas = async (): Promise<CajaData[]> => {
    try {
        // Obtén el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No se encontró un token de autenticación.');
        }

        // Realiza la solicitud al endpoint
        const response = await axios.get(`${BASE_URL}listar-caja/`, { //ruta de la api
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Devuelve los datos obtenidos
        return response.data;
    } catch (error) {
        console.error('Error al listar las cajas:', error);
        throw error;
    }
};
