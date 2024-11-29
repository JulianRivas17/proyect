import jwt_decode from 'jwt-decode';

interface DecodedToken {
  exp: number;
  user_id?: number; 
  group?: string;
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


interface DecodedToken {
  group?: string;
}

export const getUserGroupFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded: DecodedToken = jwt_decode(token);
      return decoded.group || null;
    } catch (error) {
      console.error("Error al decodificar el token", error);
      return null;
    }
  }
  return null;
};

export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded: DecodedToken = jwt_decode(token);
      return decoded.user_id || null;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }
  return null;
}

export const actualizarContrasena = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, new_password: newPassword, confirm_password: confirmPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al actualizar la contraseña");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en actualizarContrasena:", error.message);
    throw error;
  }
};

export const validarCodigo = async (email: string, code: string) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/validate-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al validar el código");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en validarCodigo:", error.message);
    throw error;
  }
};

export const enviarCodigo = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/send-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al enviar el código");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error en enviarCodigo:", error.message);
    throw error;
  }
};