import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import { obtenerUsuarioPorId, actualizarUsuario, obtenerRoles } from '../../../services/usersService';

const { Option } = Select;

interface EditUserModalProps {
    visible: boolean;
    userId: number;
    onCancel: () => void;
    onEditComplete: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ visible, userId, onCancel, onEditComplete }) => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any>(null); // Inicia como null para no mostrar nada por defecto
    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (visible && userId) {
                try {
                    const user = await obtenerUsuarioPorId(userId);
                    setUserData(user); // Cargar los datos del usuario
                    const rolesData = await obtenerRoles(); // Obtener los roles
                    setRoles(rolesData);
                } catch (error) {
                    message.error('Error al cargar los datos del usuario');
                    console.error('Error al cargar los datos del usuario:', error);
                }
            } else {
                setUserData(null); // Resetear datos cuando el modal se cierra
            }
        };

        fetchData();
    }, [visible, userId]);

    const handleUpdateUsuario = async (values: any) => {
        setLoading(true);

        const usuarioData: { 
            username: string, 
            email: string, 
            first_name: string, 
            last_name: string, 
            roles: string[], 
            password?: string  // Aquí definimos que password es opcional
        } = {
            username: values.username,
            email: values.email,
            first_name: values.nombre,
            last_name: values.apellido,
            roles: [values.rol],
        };

        // Si la contraseña ha sido proporcionada, la incluimos en el usuarioData
        if (values.password) {
            usuarioData.password = values.password;
        }

        try {
            await actualizarUsuario(userId, usuarioData);
            message.success('Usuario actualizado exitosamente');
            onEditComplete(); // Actualizar lista de usuarios después de la edición
        } catch (error) {
            message.error('Error al actualizar el usuario');
            console.error('Error al actualizar el usuario:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setUserData(null); // Resetear userData al cerrar el modal
        onCancel();
    };

    // Validación de contraseña
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

    return (
        <Modal
            title="Editar Usuario"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            {userData && (
                <Form
                    onFinish={handleUpdateUsuario}
                    initialValues={{
                        username: userData.username, // Se agrega el username
                        nombre: userData.first_name,
                        apellido: userData.last_name,
                        email: userData.email,
                        rol: userData.assigned_roles && userData.assigned_roles.length > 0 ? userData.assigned_roles[0] : '',
                    }}
                    layout="vertical"
                >
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

                    <Form.Item name="rol" label="Rol" rules={[{ required: true, message: 'Elige un rol' }]}>
                        <Select placeholder="Elige un rol">
                            {roles.map((rol: any) => (
                                <Option key={rol.id} value={rol.name}>
                                    {rol.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="default" onClick={handleCancel} style={{ marginRight: 8 }}>
                            Cancelar
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Guardar
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default EditUserModal;
