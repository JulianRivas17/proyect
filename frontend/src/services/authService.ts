import jwt_decode from 'jwt-decode';

interface DecodedToken {
  exp: number;
}
export interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

const API_URL = 'http://localhost:8000';

export const registerUser = async (values: RegisterValues) => {
  const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: values.name,
          email: values.email,
          password: values.password,
          first_name: '',
          last_name: ''
      }),
  });

  if (!response.ok) {
      throw new Error('Error al registrar el usuario');
  }

  return await response.json();
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  try {
    const decoded: DecodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn('Token expirado');
      localStorage.removeItem('token'); 
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error al decodificar el token', error);
    localStorage.removeItem('token');
    return false;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username, 
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error('Error en la autenticación, verifica tus credenciales');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};
