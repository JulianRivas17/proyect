// src/components/Pedido.tsx
import React, { useState } from "react";
import { Layout, Input, Button, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

import "./landing.css";
import iconBrunnete from "../../assets/images/cocinero.png";
import { getOrderStatus } from "../../services/ventas_services";

const { Footer } = Layout;

const estadoPedidoOptions: { [key in 'ENESPERA' | 'ENPROCESO' | 'ENTREGADO' | 'LISTO']: string } = {
  'ENESPERA': 'En espera',
  'ENPROCESO': 'En proceso',
  'ENTREGADO': 'Entregado',
  'LISTO': 'Listo para entregar'
};


const Pedido: React.FC = () => {
  const [orderCode, setOrderCode] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLandingPage = () => {
    navigate("/landing");
  };

  const handleSearch = async () => {
    if (!orderCode.trim()) {
      message.error("Por favor ingresa un código de pedido.");
      return;
    }

    setLoading(true);

    try {
      const data = await getOrderStatus(orderCode); // Llamada al servicio
      if (data) {
        const translatedStatus = estadoPedidoOptions[data.estado_pedido as keyof typeof estadoPedidoOptions];
        setOrderStatus(translatedStatus || "Estado desconocido");
      } else {
        setOrderStatus("Pedido no encontrado");
      }
    } catch (error) {
      message.error("Error al buscar el pedido.");
      setOrderStatus(null);
    }

    setLoading(false);
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
        <h2 style={{color: "white", fontSize:"24px", fontWeight:"400"}}>Busca tu Pedido</h2>
        <p style={{color: "white", marginTop: "-10px", fontSize:"15px"}}>Ingresá el código de tu pedido para saber el estado</p>
        <div style={{display:"flex", justifyContent:"space-between", marginTop: "20px"}}>
          <Input
            placeholder="Ingresa el código del pedido"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            style={{ width: "100%", marginRight: 10}}
          />
          <Button type="primary" onClick={handleSearch} loading={loading}
          style={{ width: "40%"}}>
            Buscar
          </Button>
        </div>
       

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
