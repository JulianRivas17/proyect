import React, { useState } from "react";
import { Layout, Input, Button, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import "./landing.css";
import iconBrunnete from "../../assets/images/cocinero.png";

const { Footer } = Layout;

const Pedido: React.FC = () => {
  const [orderCode, setOrderCode] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLandingPage = () => {
    navigate("/landing");
  };

  const mockOrders = [
    { code: "orden-Ani0010", status: "En proceso" },
    { code: "orden-Juan0023", status: "Enviado" },
  ];

  const handleSearch = async () => {
    if (!orderCode.trim()) {
      message.error("Por favor ingresa un código de pedido.");
      return;
    }

    setLoading(true);

    // Aquí debes hacer la búsqueda real. Por ahora usaremos un código simulado.
    setTimeout(() => {
      // Simulamos una búsqueda exitosa de un pedido
      if (orderCode === "orden-Ani0010") {
        setOrderStatus("Pedido confirmado y en proceso");
      } else {
        setOrderStatus("Pedido no encontrado");
      }
      setLoading(false);
    }, 1000); // Simulación de retraso (en un caso real usarías una API)
  };

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
      ></Button>

      <div style={{ padding: 20 }}>
        <h2>Buscar Pedido</h2>
        <Input
          placeholder="Ingresa el código del pedido"
          value={orderCode}
          onChange={(e) => setOrderCode(e.target.value)}
          style={{ width: 300, marginRight: 10 }}
        />
        <Button type="primary" onClick={handleSearch} loading={loading}>
          Buscar
        </Button>

        {/* Mostrar el código y el estado debajo */}
        {orderStatus && (
          <Card style={{ marginTop: 20 }}>
            <h4>Resultado de la búsqueda:</h4>
            <p>
              <strong>Código:</strong> {orderCode}
            </p>
            <p>
              <strong>Estado:</strong> {orderStatus}
            </p>
          </Card>
        )}
      </div>

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

export default Pedido;
