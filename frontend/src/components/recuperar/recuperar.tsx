import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Input, message } from 'antd';
import './recuperar.css';
import { actualizarContrasena, enviarCodigo, validarCodigo } from '../../services/authService';
import registerImage from '../../assets/images/login.png';

const Recuperar = () => {
  const [etapa, setEtapa] = useState<number>(1); // 1: Solicitar email, 2: Validar código, 3: Cambiar contraseña
  const [email, setEmail] = useState<string>('');
  const [codigo, setCodigo] = useState<string>('');

  const handleEnviarCodigo = async (email: string) => {
    try {
      await enviarCodigo(email);
      message.success('Código enviado al correo');
      setEmail(email);
      setEtapa(2);
    } catch (error) {
      message.error('Error al enviar el código, verifica el correo');
    }
  };

  const handleValidarCodigo = async (codigo: string) => {
    try {
      await validarCodigo(email,codigo);
      message.success('Código validado correctamente');
      setCodigo(codigo);
      setEtapa(3);
    } catch (error) {
      message.error('Código inválido, intenta de nuevo');
    }
  };

  const handleActualizarContrasena = async (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      message.error('Las contraseñas no coinciden');
      return;
    }
    try {
      await actualizarContrasena(email, password, confirmPassword);
      message.success('Contraseña actualizada exitosamente');
      setEtapa(1); // Regresar al inicio
    } catch (error) {
      message.error('Error al actualizar la contraseña');
    }
  };

  const handleRedirect = () => {
    window.location.href = '/';  // Redirige a /Login
  };

  return (
    <div className="login-page">
      <div className="login-container">
      <h2>Recuperar contraseña</h2>
        <p style={{marginBottom: '10px'}}>Ingresa el mail asociado a tu cuenta</p>
        {etapa === 1 && (
          <Formik
            initialValues={{ email: '' }}
            onSubmit={(values) => handleEnviarCodigo(values.email)}
          >
            {() => (
              <Form>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <Field name="email">
                    {({ field }: any) => (
                      <Input {...field} placeholder="Ingresa tu correo electrónico" />
                    )}
                  </Field>
                </div>
                <div className="flex">
                  <Button type="primary" className="button-return" onClick={handleRedirect}>
                    Regresar
                  </Button>
                  <Button type="primary" htmlType="submit" className="submit-button">
                    Enviar código
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}

        {etapa === 2 && (
          <Formik
            initialValues={{ codigo: '' }}
            onSubmit={(values) => handleValidarCodigo(values.codigo)}
          >
            {() => (
              <Form>
                <div className="form-group">
                  <label htmlFor="codigo">Código de verificación</label>
                  <Field name="codigo">
                    {({ field }: any) => (
                      <Input {...field} placeholder="Ingresa el código enviado a tu correo" />
                    )}
                  </Field>
                </div>
                <Button type="primary" htmlType="submit" className="submit-button">
                  Validar código
                </Button>
              </Form>
            )}
          </Formik>
        )}

        {etapa === 3 && (
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            onSubmit={(values) =>
              handleActualizarContrasena(values.password, values.confirmPassword)
            }
          >
            {() => (
              <Form>
                <div className="form-group">
                  <label htmlFor="password">Nueva contraseña</label>
                  <Field name="password">
                    {({ field }: any) => (
                      <Input.Password {...field} placeholder="Ingresa tu nueva contraseña" />
                    )}
                  </Field>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <Field name="confirmPassword">
                    {({ field }: any) => (
                      <Input.Password {...field} placeholder="Confirma tu nueva contraseña" />
                    )}
                  </Field>
                </div>
                <Button type="primary" htmlType="submit" className="submit-button">
                  Actualizar contraseña
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="login-image">
        <img src={registerImage} alt="background" />
      </div>
    </div>
  );
};

export default Recuperar;
