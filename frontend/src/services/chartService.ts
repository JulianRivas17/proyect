import axios from 'axios';

const BASE_URL = 'http://localhost:8000/dashboard/chart-data/';

export const fetchChartData = async (chartType: string, startDate?: string, endDate?: string) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token desde localStorage
  
      if (!token) {
        throw new Error('No se encontró un token de autenticación.');
      }
  
      const params = {
        chart_type: chartType,
        start_date: startDate || '',
        end_date: endDate || '',
      };
  
      const response = await axios.get(BASE_URL, {
        params,
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token a los headers de la solicitud
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  };