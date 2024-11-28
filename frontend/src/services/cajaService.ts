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
    total_ventas: number | null; 
}

export interface Caja {
  id: number;
  estado_caja: boolean;
  fecha_hs_aper_caja: string;
  total_ventas: number;
  nombre: string;
}

// Función para obtener la lista de cajas
export const listarCajas = async (filtros: { estado?: string, nombre?: string, sortField?: string, sortOrder?: string }): Promise<CajaData[]> => {
  try {
      const params: any = {};

      if (filtros.estado) {
          params.estado = filtros.estado;
      }

      if (filtros.nombre) {
          params.nombre = filtros.nombre;
      }

      if (filtros.sortField) {
          params.sortField = filtros.sortField;
          params.sortOrder = filtros.sortOrder;  // Incluimos el orden de la columna
      }

      // Obtén el token del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
          throw new Error('No se encontró un token de autenticación.');
      }

      // Realiza la solicitud al endpoint
      const response = await axios.get(`${BASE_URL}listar-caja/`, {
          params,
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      return response.data;
  } catch (error) {
      console.error("Error al listar las cajas:", error);
      throw error;
  }
};



export const abrirCaja = async (montoInicial: number, nombre: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró un token de autenticación.');
  
      const response = await axios.post(`${BASE_URL}abrir-caja/`, {
        monto_inicial: montoInicial,
        nombre: nombre
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al abrir la caja:', error);
      throw error;
    }
  };

  export const cerrarCaja = async (cajaId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró un token de autenticación.');
  
      const response = await axios.post(`${BASE_URL}cerrar-caja/${cajaId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al cerrar la caja:', error);
      throw error;
    }
  }; 

  export const obtenerCajasAbiertas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró un token de autenticación.');

      const response = await axios.get(`${BASE_URL}cajas-abiertas/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
      return response.data; // Retorna el listado de cajas abiertas
    } catch (error) {
      console.error('Error al obtener las cajas abiertas', error);
      throw error;
    }
  };

  export const existenCajasAbiertas = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${BASE_URL}exist-caja-abierta`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = response.data
        return data;
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        throw error;
    }
};
