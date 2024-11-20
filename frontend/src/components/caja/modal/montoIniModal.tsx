import React from 'react';
import { Modal, Button, Input, Typography, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface ModalMontoInicialProps {
    visible: boolean;
    onClose: () => void;
}

const ModalMontoInicial: React.FC<ModalMontoInicialProps> = ({ visible, onClose }) => {
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
            <Typography.Title level={4} style={{ color: '#4CAF50', fontWeight: 'bold', marginBottom: 0 }}> {/*titulo*/}
                Nuevo Monto Inicial 
            </Typography.Title>
            <div style={{ width: '100%', borderBottom: '1px solid #e0e0e0', marginTop: '10px' }} />

            <Typography.Title level={2} style={{ marginTop: '5px', fontWeight: 'bold', textAlign: 'left'}}>
                Monto Inicial
            </Typography.Title>
            <Input
                placeholder="Ingrese el monto inicial del día"
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
                        fontSize:'20px'
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    icon={<CheckCircleOutlined />}
                    type="primary"
                    style={{
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
                        borderRadius: '8px',
                        padding: '20px 40px',
                        fontSize:'20px'
                    }}
                >
                    Continuar
                </Button>
            </Space>
        </Modal>
    );
};

export default ModalMontoInicial;
