import React from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface AddProductoModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
}

const AddProductoModal: React.FC<AddProductoModalProps> = ({ visible, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const [imageFileList, setImageFileList] = React.useState<any[]>([]);

    const handleFinish = (values: any) => {
        const formData = new FormData();
        formData.append('nombre_prod', values.nombre_prod);
        formData.append('precio_prod', values.precio_prod);
    
        if (imageFileList.length > 0) {
            const file = imageFileList[0].originFileObj;
    
            // Crear un archivo nuevo con la extensión `.jpg`
            const renamedFile = new File(
                [file], // Contenido del archivo
                `${file.name.split('.')[0]}.jpg`, // Renombrar con la extensión .jpg
                { type: 'image/jpeg' } // Especificar el tipo MIME
            );
    
            formData.append('image_url', renamedFile);
        }
    
        onSubmit(formData);
        form.resetFields();
        setImageFileList([]);
    };

    const handleImageChange = ({ fileList }: any) => {
        setImageFileList(fileList);
    };

    return (
        <Modal
            title="Agregar Producto"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
            >
                <Form.Item
                    name="nombre_prod"
                    label="Nombre del Producto"
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="precio_prod"
                    label="Precio del Producto"
                    rules={[{ required: true, message: 'Este campo es obligatorio' }]}
                >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="image" label="Imagen del Producto">
                    <Upload
                        beforeUpload={() => false}
                        fileList={imageFileList}
                        listType="picture"
                        onChange={handleImageChange}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Agregar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddProductoModal;
