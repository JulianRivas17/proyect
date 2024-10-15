import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Button, Input } from 'antd';
import './register.css';
import registerImage from '../../assets/images/login.png';

const Register = () => {
    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Regístrate aquí</h2>
                <p>Completa los campos para crear tu cuenta</p>
                <Formik
                    initialValues={{ name: '', email: '', password: '' }}
                    onSubmit={(values) => {
                        console.log('Register values', values);
                    }}
                >
                    {() => (
                        <Form>
                            <div className="form-group">
                                <label htmlFor="name">Nombre</label>
                                <Field name="name">
                                    {({ field }: any) => (
                                        <Input {...field} placeholder="Ingresa tu nombre" />
                                    )}
                                </Field>
                            </div>
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
                            <Button type="primary" htmlType="submit" className="submit-button">Registrarse</Button>
                        </Form>
                    )}
                </Formik>
                <div className="extra-options">
                    <p>¿Ya tienes una cuenta? <a href="/">Inicia sesión</a></p>
                </div>
            </div>
            <div className="register-image">
                <img src={registerImage} alt="background" />
            </div>
        </div>
    );
};

export default Register;
