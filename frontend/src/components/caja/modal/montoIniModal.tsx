import React, { useState } from 'react';
import { Modal, Button, Input, Typography, Space, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface ModalMontoInicialProps {
    visible: boolean;
    onClose: () => void;
    onMontoSet: (monto: number) => void; // Nueva prop para pasar el monto inicial
}

const ModalMontoInicial: React.FC<ModalMontoInicialProps> = ({ visible, onClose, onMontoSet }) => {
    const [monto, setMonto] = useState<string>(''); // Estado para almacenar el monto

    

    // Manejar el cambio en el campo de entrada
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonto(e.target.value);
        
    };

    // Manejar la acción del botón "Continuar"
    const handleAccept = () => {
        if (!monto || isNaN(Number(monto))) {
            message.error('Por favor, ingrese un monto válido.');
            return;
        }
        message.success(`El monto inicial de $${monto} se guardó correctamente.`);
        onMontoSet(Number(monto)); //guardo el valor
        onClose(); // Cierra el modal después de guardar el monto
    };

    return (
        <Modal
            title={null}
            visible={visible}
            onCancel={onClose}
            footer={null}
            closeIcon={<span style={{ fontSize: '16px', cursor: 'pointer' }}>×</span>}
            bodyStyle={{
                padding: '10px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
            }}
        >
            <Typography.Title level={4} style={{ color: '#4CAF50', fontWeight: 'bold', marginBottom: 0 }}>
                Nuevo Monto Inicial
            </Typography.Title>
            <div style={{ width: '100%', borderBottom: '1px solid #e0e0e0', marginTop: '10px' }} />

            <Typography.Title level={2} style={{ marginTop: '5px', fontWeight: 'bold', textAlign: 'left' }}>
                Monto Inicial
            </Typography.Title>
            <Input
                placeholder="Ingrese el monto inicial del día"
                value={monto !== null? monto : ' '} // Vinculamos el valor del input al estado
                onChange={handleInputChange} // Actualizamos el estado cuando cambie el valor
                style={{
                    marginBottom: '20px',
                    borderRadius: '8px',
                    padding: '5px',
                    fontSize: '16px',
                }}
            />
            <div style={{ width: '100%', borderBottom: '1px solid #e0e0e0', marginBottom: '10px' }} />
            <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
                <Button
                    icon={<CloseCircleOutlined />}
                    onClick={onClose}
                    style={{
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        borderRadius: '8px',
                        padding: '20px 40px',
                        fontSize: '20px',
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    icon={<CheckCircleOutlined />}
                    type="primary"
                    onClick={handleAccept} // Maneja el clic del botón "Continuar"
                    style={{
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
                        borderRadius: '8px',
                        padding: '20px 40px',
                        fontSize: '20px',
                    }}
                >
                    Continuar
                </Button>
            </Space>
        </Modal>
    );
};

export default ModalMontoInicial;
