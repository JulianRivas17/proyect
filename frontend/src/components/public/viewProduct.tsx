import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Button, Input } from "antd";
import {
  InstagramOutlined,
  FacebookOutlined,
  EnvironmentOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import "./landing.css";
import iconBrunnete from "../../assets/images/cocinero.png";

const { Footer } = Layout;

const ViewProduct: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const producto = location.state?.producto;

  const [count, setCount] = useState(1); // Cantidad seleccionada
  const [totalPrice, setTotalPrice] = useState<number>(
    producto?.precio_prod || 0
  ); // Precio total dinámico

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    setTotalPrice(newCount * producto.precio_prod); // Actualizar precio total
  };

  const handleDecrement = () => {
    if (count > 1) {
      const newCount = count - 1;
      setCount(newCount);
      setTotalPrice(newCount * producto.precio_prod); // Actualizar precio total
    }
  };

  const handleLandingPage = () => {
    navigate("/landing"); // Regresa a la página principal
  };

  if (!producto) {
    return <p>Error: No se encontró información del producto.</p>;
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
          <div className="contain-social-networking">
            <Button
              className="item-social-network"
              type="primary"
              icon={<InstagramOutlined />}
            ></Button>
            <Button
              className="item-social-network"
              type="primary"
              icon={<FacebookOutlined />}
            ></Button>
            <Button
              className="item-social-network"
              type="primary"
              icon={<EnvironmentOutlined />}
            ></Button>
          </div>
        </div>
      </div>

      {/* Info del Producto */}
      <div className="container-info-product">
        <div className="img-product">
          <Button
            className="return-page"
            onClick={handleLandingPage}
            type="primary"
            icon={<LeftOutlined />}
          ></Button>
          <img
            className="img-product-custom"
            src={producto.image_url || "https://via.placeholder.com/150"}
            alt={producto.nombre_prod}
          />
        </div>
        <div className="info-product-selected">
          <div className="contain-body-Product">
            <h3 className="title-Product">{producto.nombre_prod}</h3>
            <p className="description-product">{producto.description}</p>
          </div>
          <div className="contain-actions custom">
            <p className="price-Product">
              ${Number(producto.precio_prod).toLocaleString("es-ES")}
            </p>
          </div>
        </div>
      </div>

      {/* Carrito dinámico */}
      <div className="shopping-card-modal">
        <div className="info-order">
          <h2 className="title-section-order">Tu pedido</h2>
          <p className="price-Product">
            ${totalPrice.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="add-order">
          <div className="counter-container">
            <Button
              type="text"
              onClick={handleDecrement}
              disabled={count <= 1}
              className="counter-button"
            >
              -
            </Button>
            <Input value={count} readOnly className="counter-input" />
            <Button
              type="text"
              onClick={handleIncrement}
              className="counter-button"
            >
              +
            </Button>
          </div>
          <Button className="add-Product-Order">Agregar</Button>
        </div>
      </div>

      {/* Footer */}
      <Footer
        className="footer-Custom"
        style={{
          textAlign: "center",
          backgroundColor: "#393844",
          color: "white",
        }}
      >
        ©2024 Brunette. Todos los derechos reservados.
      </Footer>
    </Layout>
  );
};

export default ViewProduct;
