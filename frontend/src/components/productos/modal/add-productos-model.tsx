import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

interface AddProductoModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
}

const AddProductoModal: React.FC<AddProductoModalProps> = ({ visible, onClose, onSubmit }) => {
    const [form] = Form.useForm();
    const [imageFileList, setImageFileList] = useState<any[]>([]);

    const handleFinish = (values: any) => {
        const formData = new FormData();
        formData.append('nombre_prod', values.nombre_prod);
        formData.append('precio_prod', values.precio_prod);
        formData.append('category', values.category); // Vincular categoría al formulario
        formData.append('description', values.description); // Vincular descripción al formulario

        // Procesar imagen, si existe
        if (imageFileList.length > 0) {
            const file = imageFileList[0].originFileObj;
            formData.append('image_url', file);
        }

        onSubmit(formData);
        form.resetFields();
        setImageFileList([]); 
        onClose();
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
                    label="Nombre del Producto*"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="precio_prod"
                    label="Precio del Producto*"
                    rules={[
                        {
                          required: true,
                          message: 'El precio del producto es obligatorio',
                        },
                        {
                          type: 'number',
                          min: 0,
                          message: 'El precio debe ser un número positivo',
                        },
                      ]}
                >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="category"
                    label="Categoría*"
                >
                    <Select placeholder="Elige una categoría" style={{ width: '100%' }}>
                        <Option value="ESPECIALIDADES">Especialidades</Option>
                        <Option value="BEBIDAS">Bebidas</Option>
                        <Option value="PRINCIPALES">Principales</Option>
                        <Option value="POSTRES">Postres</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Descripción*"
                >
                    <TextArea rows={4} placeholder="Escribe una descripción del producto" />
                </Form.Item>

                <Form.Item name="image" label="Imagen del Producto*">
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
