// src/services/authService.ts

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

const API_URL = 'http://localhost:8000';  // Cambia la URL según sea necesario

export const registerUser = async (values: RegisterValues) => {
  const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: values.name,     // En el backend espera 'username'
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

