import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, DatePicker } from 'antd';
import moment from 'moment';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ModalAperturaCajaProps {
    visible: boolean;
    onClose: () => void;
    montoInicial: number; // Recibe el monto inicial desde el modal anterior
}

const ModalAperturaCaja: React.FC<ModalAperturaCajaProps> = ({ visible, onClose, montoInicial }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            // Setea los valores iniciales del formulario
            form.setFieldsValue({
                fecha: moment(), // Fecha actual
                montoInicial: montoInicial, // Monto inicial desde las props
            });
        }
    }, [visible, montoInicial, form]);

    const handleFinish = (values: any) => {
        console.log('Datos del formulario:', values);
        form.resetFields(); // Limpia los campos del formulario después de enviar
        onClose(); // Cierra el modal
    };

    return (
        <Modal
            title={<span style={{ color: 'green' }}>Apertura de Caja</span>}
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    turno: '',
                    cajero: '',
                }}
            >
                {/* Campo Fecha */}
                <Form.Item
                    label="Fecha *"
                    name="fecha"
                    rules={[{ required: true, message: 'Por favor selecciona una fecha' }]}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                        placeholder="Seleccionar fecha"
                        disabled // Deshabilitado para que no se pueda editar
                    />
                </Form.Item>

                {/* Campo Turno */}
                <Form.Item
                    label="Turno *"
                    name="turno"
                    rules={[{ required: true, message: 'Por favor selecciona un turno' }]}
                >
                    <Select placeholder="Elegir una opción">
                        <Option value="mañana">Mañana</Option>
                        <Option value="tarde">Tarde</Option>
                        <Option value="noche">Noche</Option>
                    </Select>
                </Form.Item>

                {/* Campo Nombre Cajero */}
                <Form.Item
                    label="Nombre Cajero"
                    name="cajero"
                    rules={[{ required: true, message: 'Por favor selecciona un cajero' }]}
                >
                    <Select placeholder="Elegir una opción">
                        <Option value="cajero1">Cajero 1</Option>
                        <Option value="cajero2">Cajero 2</Option>
                        <Option value="cajero3">Cajero 3</Option>
                    </Select>
                </Form.Item>

                {/* Campo Monto Inicial */}
                <Form.Item
                    label="Monto Inicial"
                    name="montoInicial"
                    rules={[{ required: true, message: 'Por favor ingresa el monto inicial' }]}
                >
                    <Input type="number" placeholder="Ingrese el monto inicial" disabled />
                </Form.Item>

                {/* Botones */}
                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Button 
                        icon={<CloseCircleOutlined />}
                        onClick={onClose} style={{borderColor: '#4CAF50',
                        color: '#4CAF50',
                        borderRadius: '8px',
                        padding: '20px 40px',
                        fontSize: '20px', }}>
                            Cancelar
                        </Button>
                        <Button 
                        icon={<CheckCircleOutlined />}
                        type="primary" htmlType="submit" style={{ backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
                        borderRadius: '8px',
                        padding: '20px 40px',
                        fontSize: '20px', }}>
                            Abrir Caja
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAperturaCaja;
