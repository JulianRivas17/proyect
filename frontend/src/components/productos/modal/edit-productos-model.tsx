import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, message, Select, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { obtenerProductoPorId, editarProducto } from '../../../services/productosService';
import { obtenerURLImagen } from '../../../services/productosService'; // Importa la función para construir la URL de la imagen

const { Option } = Select;
const { TextArea } = Input;

interface EditProductoModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>; // Cambiar success a formData
    productId: number | null; // Recibe solo el ID del producto
}

const EditProductoModal: React.FC<EditProductoModalProps> = ({ visible, onClose, onSubmit, productId }) => {
    const [form] = Form.useForm();
    const [imageFileList, setImageFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productId && visible) {
            // Cargar los datos del producto por ID
            setLoading(true);
            obtenerProductoPorId(productId)
                .then((producto) => {
                    form.setFieldsValue({
                        nombre_prod: producto.nombre_prod,
                        precio_prod: producto.precio_prod,
                        categoria: producto.category, // Cargar la categoría
                        descripcion: producto.description, // Cargar la descripción
                    });

                    // Configurar la imagen existente (si la hay)
                    if (producto.image_url) {
                        const urlCompleta = obtenerURLImagen(producto.image_url); // Convierte la ruta relativa en absoluta
                        setImageFileList([
                            {
                                uid: '-1',
                                name: producto.image_url.split('/').pop(),
                                status: 'done',
                                url: urlCompleta,
                            },
                        ]);
                    }
                })
                .catch(() => {
                    message.error('Error al cargar los datos del producto');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            form.resetFields();
            setImageFileList([]);
        }
    }, [productId, visible, form]);

    const handleFinish = async (values: any) => {
        if (!productId) {
            message.error('No se pudo identificar el producto a editar.');
            return;
        }

        const formData = new FormData();
        formData.append('nombre_prod', values.nombre_prod);
        formData.append('precio_prod', values.precio_prod);
        formData.append('category', values.categoria); // Añadir la categoría al formData
        formData.append('description', values.descripcion); // Añadir la descripción al formData

        // Procesar imagen, si existe
        if (imageFileList.length > 0 && imageFileList[0]?.originFileObj) {
            const file = imageFileList[0].originFileObj;
            formData.append('image_url', file);
        }

        try {
            await onSubmit(formData); // Enviar al backend
            onClose();
        } catch (error) {
            message.error('Error al editar el producto');
        }
    };

    const handleImageChange = ({ fileList }: any) => {
        setImageFileList(fileList);
    };

    return (
        <Modal
            title="Editar Producto"
            visible={visible}
            onCancel={onClose}
            footer={null}
        >
            {loading ? (
                <Spin tip="Cargando..." />
            ) : (
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

                    >
                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="categoria"
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
                        name="descripcion"
                        label="Descripción"

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
                            Guardar Cambios
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default EditProductoModal;
