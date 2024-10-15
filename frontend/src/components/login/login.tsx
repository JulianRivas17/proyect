import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Input } from 'antd';
import './login.css';
import registerImage from '../../assets/images/login.png';


const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>¡Bienvenido de nuevo!</h2>
        <p>Ingresa tus credenciales para acceder a tu cuenta</p>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={(values) => {
            console.log('Login values', values);
          }}
        >
          {() => (
            <Form>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <Field name="email">
                  {({ field }: any) => (
                    <Input {...field} placeholder="Ingresa tu email" />
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
