import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Input, message } from 'antd';
import './login.css';
import registerImage from '../../assets/images/login.png';
import { loginUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>¡Bienvenido de nuevo!</h2>
        <p>Ingresa tus credenciales para acceder a tu cuenta</p>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={async (values) => {
            try {
              const data = await loginUser(values.username, values.password);
              localStorage.setItem('token', data.access);
              message.success('Inicio de sesión exitoso');
              navigate('/home');
            } catch (error) {
              message.error('Error al iniciar sesión, verifica tus credenciales');
            }
          }}
        >
          {() => (
            <Form>
              <div className="form-group">
                <label htmlFor="username">Nombre de usuario</label>
                <Field name="username">
                  {({ field }: any) => (
                    <Input {...field} placeholder="Ingresa tu nombre de usuario" />
                  )}
                </Field>
              </div>
              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <Field name="password" type="password">
                  {({ field }: any) => (
                    <Input.Password {...field} placeholder="Ingresa tu contraseña" />
                  )}
                </Field>
              </div>
              <Button type="primary" htmlType="submit" className="submit-button">Iniciar Sesión</Button>
            </Form>
          )}
        </Formik>
        <div className="extra-options">
          <p>¿No tienes una cuenta? <a href="/register">Regístrate</a></p>
        </div>
      </div>
      <div className="login-image">
        <img src={registerImage} alt="background" />
      </div>
    </div>
  );
};

export default Login;
