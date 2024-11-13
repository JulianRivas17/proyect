import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import { obtenerRoles, crearUsuario } from '../../../services/usersService';

const { Option } = Select;

interface NuevoEmpleadoModalProps {
    visible: boolean;
    onCancel: () => void;
    onAddComplete: () => void;
}

const NuevoEmpleadoModal: React.FC<NuevoEmpleadoModalProps> = ({ visible, onCancel, onAddComplete }) => {
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

    // Cargar roles al montar el componente
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const rolesData = await obtenerRoles();
                setRoles(rolesData);
            } catch (error) {
                message.error('Error al cargar los roles');
                console.error('Error al obtener roles:', error);
            }
        };

        if (visible) {
            fetchRoles();
        }
    }, [visible]);

    // Validador de seguridad de la contraseña
    const passwordValidator = (_: any, value: string) => {
        if (!value) {
            return Promise.reject(new Error('La contraseña es obligatoria'));
        } else if (value.length < 8) {
            return Promise.reject(new Error('La contraseña debe tener al menos 8 caracteres'));
        } else if (!/[A-Z]/.test(value)) {
            return Promise.reject(new Error('La contraseña debe tener al menos una letra mayúscula'));
        } else if (!/[a-z]/.test(value)) {
            return Promise.reject(new Error('La contraseña debe tener al menos una letra minúscula'));
        } else if (!/[0-9]/.test(value)) {
            return Promise.reject(new Error('La contraseña debe tener al menos un número'));
        } else if (!/[!@#$%^&*]/.test(value)) {
            return Promise.reject(new Error('La contraseña debe tener al menos un carácter especial (!@#$%^&*)'));
        }
        return Promise.resolve();
    };

    const handleAddUsuario = async (values: any) => {
        setLoading(true);
        try {
            const usuarioData = {
                username: values.username, // Usamos el nombre de usuario ingresado
                email: values.email,
                first_name: values.nombre,
                last_name: values.apellido,
                password: values.password,
                roles: [values.rol],
            };

            await crearUsuario(usuarioData);
            message.success('Usuario añadido exitosamente');
            onAddComplete();
            onCancel();
        } catch (error) {
            message.error('Error al añadir el usuario');
            console.error('Error al añadir el usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Nuevo Empleado"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form onFinish={handleAddUsuario} layout="vertical">
                <Form.Item name="username" label="Nombre de Usuario" rules={[{ required: true, message: 'Escribe el nombre de usuario' }]}>
                    <Input placeholder="Escribe el nombre de usuario" />
                </Form.Item>

                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Escribe el nombre' }]}>
                    <Input placeholder="Escribe el nombre" />
                </Form.Item>

                <Form.Item name="apellido" label="Apellido" rules={[{ required: true, message: 'Escribe el apellido' }]}>
                    <Input placeholder="Escribe el apellido" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'El correo electrónico es obligatorio' },
                        { type: 'email', message: 'Por favor, escribe un correo electrónico válido' },
                    ]}
                >
                    <Input placeholder="Escribe el correo electrónico" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Contraseña"
                    rules={[
                        { required: true, message: 'La contraseña es obligatoria' },
                        { validator: passwordValidator },
                    ]}
                    hasFeedback
                >
                    <Input.Password placeholder="Escribe la contraseña" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirmar Contraseña"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        { required: true, message: 'Confirma la contraseña' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Las contraseñas no coinciden'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Confirma la contraseña" />
                </Form.Item>

                <Form.Item name="rol" label="Rol" rules={[{ required: true, message: 'Elige un rol' }]}>
                    <Select placeholder="Elige un rol">
                        {roles.map((rol) => (
                            <Option key={rol.id} value={rol.name}>
                                {rol.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Añadir
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NuevoEmpleadoModal;
