import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Button, Input, Spin, Modal, Empty } from "antd";
import { LeftOutlined, DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import "./landing.css";
import iconBrunnete from "../../assets/images/cocinero.png";
import { useCart } from "./CartContext";

const { Footer } = Layout;

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
  const [selectedItem, setSelectedItem] = useState<number | null>(null); // Producto seleccionado para eliminar
  const [isLoading, setIsLoading] = useState(false); // Controla la pantalla de carga

  const handleLandingPage = () => {
    navigate("/landing");
  };

  const totalCarrito = cart.reduce(
    (total, item) => total + item.precioTotal,
    0
  );

  const showModal = (id: number) => {
    setSelectedItem(id); // Guarda el ID del producto seleccionado
    setIsModalVisible(true); // Muestra el modal
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false); // Cierra el modal

    setTimeout(() => {
      setIsLoading(true); // Muestra la pantalla de carga

      // Si es el último producto, eliminar y redirigir después de 3 segundos
      if (cart.length === 1 && selectedItem !== null) {
        removeFromCart(selectedItem);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/landing");
        }, 500); // 3 segundos de espera
      } else if (selectedItem !== null) {
        removeFromCart(selectedItem); // Elimina el producto
        setIsLoading(false);
      }

      setSelectedItem(null); // Limpia el producto seleccionado
    }, 300); // Ajuste de transición para el modal
  };

  const handleCancelDelete = () => {
    setIsModalVisible(false); // Cierra el modal
    setSelectedItem(null); // Limpia el producto seleccionado
  };

  // Mostrar pantalla de carga si está activa
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Layout className="container-principal">
      {/* Menú de navegación */}
      <div className="categories-tab">
        <div className="contain-banner-flex">
          <div className="contain-logo">
            <img className="icon-logo-brunnete" src={iconBrunnete} alt="" />
            <h1>Resto Brunette</h1>
          </div>
        </div>
      </div>

      {/* Botón para regresar */}
      <Button
        className="return-page custom"
        onClick={handleLandingPage}
        type="primary"
        icon={<LeftOutlined />}
      >
      </Button>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <ShoppingOutlined style={{ fontSize: "64px", color: "#888" }} />
          <p>No hay productos en el carrito.</p>
        </div>
      ) : (
        <>
          {/* Productos en el carrito */}
          <div className="cart-items-container">
            {cart.map((item) => (
              <div className="card-Product border" key={item.id}>
                <img
                  src={item.imagen || "https://via.placeholder.com/150"}
                  alt={item.nombre}
                  style={{ objectFit: "cover" }}
                />
                <div className="contain-body-Product">
                  <h3 className="title-Product">
                    {item.nombre} <span>(x{item.cantidad})</span>
                  </h3>
                  <p className="description-product">{item.descripcion}</p>
                </div>
                <div className="contain-actions">
                  <p className="price-Product">
                    ${item.precioTotal.toLocaleString("es-ES")}
                  </p>
                  <div className="counter-container">
                    <Button
                      type="text"
                      onClick={() =>
                        item.cantidad > 1 &&
                        updateQuantity(item.id, item.cantidad - 1)
                      }
                      disabled={item.cantidad <= 1}
                      className="counter-button"
                    >
                      -
                    </Button>
                    <Input
                      value={item.cantidad}
                      readOnly
                      className="counter-input"
                    />
                    <Button
                      type="text"
                      onClick={() =>
                        updateQuantity(item.id, item.cantidad + 1)
                      }
                      className="counter-button"
                    >
                      +
                    </Button>
                  </div>
                  <div className="actions">
                    <Button
                      className="btn-delete"
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => showModal(item.id)} // Muestra el modal
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de confirmación */}
          <Modal
            title="¿Estás seguro?"
            visible={isModalVisible}
            onOk={handleConfirmDelete} // Confirmar eliminación
            onCancel={handleCancelDelete} // Cancelar eliminación
            okText="Sí, eliminar"
            cancelText="Cancelar"
          >
            <p>Borrarás este producto de tu pedido.</p>
          </Modal>

          {/* Modal de total del carrito */}
          <div className="shopping-card-modal custom-m">
            <div className="info-order">
              <h2 className="title-section-order">Total</h2>
              <p className="price-Product">
                ${totalCarrito.toLocaleString("es-ES")}
              </p>
            </div>
            <div className="add-order flex">
              <Button
                className="add-more-product"
                onClick={() => navigate("/landing")}
              >
                Agregar más productos
              </Button>
              <Button className="add-order-btn">Hacer Pedido</Button>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <Footer
        className="footer-Custom"
        style={{
          textAlign: "center",
          backgroundColor: "#393844",
          color: "white",
          position: "absolute",
          bottom: "0",
          width: "640px",
        }}
      >
        ©2024 Brunette. Todos los derechos reservados.
      </Footer>
    </Layout>
  );
};

export default Cart;
