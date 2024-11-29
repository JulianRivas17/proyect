// src/components/public/LandingPage.tsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Menu, Layout, Button, Carousel, message, Input } from "antd";
import {
  InstagramOutlined,
  FacebookOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./landing.css";
import iconBrunnete from "../../assets/images/cocinero.png";
import { useCart } from "./CartContext";

/* Productos */
import {
  obtenerProductos,
  ProductoDisponible,
} from "../../services/ventas_services";
import { obtenerURLImagen } from "../../services/productosService";

const { Content, Footer } = Layout;
const { Meta } = Card;

const LandingPage: React.FC = () => {
  // Define los refs para cada sección
  const [productos, setProdutos] = useState<ProductoDisponible[]>([]);
  const mostSoldRef = useRef<HTMLDivElement>(null);
  const combosRef = useRef<HTMLDivElement>(null);
  const specialsRef = useRef<HTMLDivElement>(null);
  const drinksRef = useRef<HTMLDivElement>(null);

  // Función para hacer scroll a una sección
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* Productos */
  const fetchProductos = async () => {
    try {
      const filtros = {}
      const productos = await obtenerProductos(filtros);
      setProdutos(productos);
      console.log("productos",productos )
    } catch (error) {
      message.error("Error al cargar los productos");
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const chunkArray = (array: any, chunkSize: any) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    console.log(chunks);
    return chunks;
  };

  const productosEspecialidades = productos.filter(
    (producto) => producto.category === "ESPECIALIDADES"
  );

  const gruposDeProductos = chunkArray(productosEspecialidades, 3);

  const navigate = useNavigate();

  const handleViewProduct = (producto: ProductoDisponible) => {
    navigate("/viewProduct", { state: { producto } }); // Navega a la página con el producto seleccionado
  };

  const handleCart = () => {
    navigate("/cart"); // Navega a la página Cart
  };

  const { calculateTotal, calculateTotalItems } = useCart(); // Usa el método para obtener el total

  const totalCarrito = calculateTotal(); // Calcula el total
  const totalProductos = calculateTotalItems(); // Calcula el total de productos

  const footerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (footerRef.current) {
        const footerTop = footerRef.current.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;

        // Si el footer está visible en la pantalla
        if (footerTop <= viewportHeight) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchOrderClick = () => {
    navigate('/pedido'); 
  };

  return (
    <Layout className="container-principal">
      {/*Header y Banner principal*/}
      <div className="container-banner"></div>

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
        <Menu
          mode="horizontal"
          theme="dark"
          className="contain-menu"
          style={{ justifyContent: "left" }}
        >
          <Menu.Item onClick={() => scrollToSection(mostSoldRef)}>
            Platos especiales
          </Menu.Item>
          <Menu.Item onClick={() => scrollToSection(combosRef)}>
            Combos
          </Menu.Item>
          <Menu.Item onClick={() => scrollToSection(specialsRef)}>
            Principales
          </Menu.Item>
          <Menu.Item onClick={() => scrollToSection(drinksRef)}>
            Bebidas
          </Menu.Item>
          <Menu.Item onClick={handleSearchOrderClick}>
            Buscar Pedido
          </Menu.Item>
        </Menu>
      </div>

      {/* Contenido de las secciones */}
      <div className="Content-products" style={{ padding: "10px" }}>
        <div ref={mostSoldRef} style={{ padding: "20px 0px 0px 0px" }}>
          <h2 className="title-section-menu">Platos especiales</h2>
          {/* Contenido de "Lo más vendido" */}

          <Carousel autoplay>
            {gruposDeProductos.map((grupo, index) => (
              <div className="contain-product-mostSold" key={index}>
                <div className="container-carousel">
                  {grupo.map((producto: any) => {
                    const urlImagen = obtenerURLImagen(
                      producto.image_url
                    )?.toString();
                    const precioFormateado = Number(
                      producto.precio_prod
                    ).toLocaleString("es-ES");

                    return (
                      <Card
                        key={producto.id}
                        className="card-Custom"
                        hoverable
                        style={{ width: 200, background: "#2d2c36" }}
                        cover={
                          <img
                            className="img-Product"
                            alt={producto.nombre_prod}
                            src={urlImagen || "https://via.placeholder.com/150"}
                            height="100px"
                          />
                        }
                      >
                        <h3 className="title-Product">
                          {producto.nombre_prod}
                        </h3>
                        <p className="price-Product">${precioFormateado}</p>
                        <Button
                          className="add-Product"
                          onClick={() => handleViewProduct(producto)}
                        >
                          <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                          Añadir al carrito
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div ref={combosRef} style={{ padding: "20px 0px 50px 0px" }}>
          <h2 className="title-section-menu">Principales</h2>
          {/* Contenido de "Combos" */}
          {productos
            .filter((producto) => producto.category === "PRINCIPALES")
            .map((producto) => {
              const urlImagen = obtenerURLImagen(
                producto.image_url
              )?.toString(); // Generar URL de la imagen
              const precioFormateado =
                producto.precio_prod.toLocaleString("es-ES");

              return (
                <div className="card-Product landing" key={producto.id}>
                  <img
                    src={urlImagen}
                    alt={producto.nombre_prod}
                    className="product-image"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="contain-body-Product">
                    <h3 className="title-Product">{producto.nombre_prod}</h3>
                    <p className="description-product">
                      {producto.description}
                    </p>
                  </div>
                  <div className="contain-actions">
                    <p className="price-Product">${precioFormateado}</p>
                    <Button
                      className="add-Product"
                      onClick={() => handleViewProduct(producto)}
                    >
                      <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                      Añadir al carrito
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>

        <div ref={specialsRef}>
          <h2 className="title-section-menu">Postres</h2>
          {/* Contenido de "Especiales" */}
          {productos
            .filter((producto) => producto.category === "POSTRES")
            .map((producto) => {
              const urlImagen = obtenerURLImagen(
                producto.image_url
              )?.toString(); // Generar URL de la imagen
              const precioFormateado =
                producto.precio_prod.toLocaleString("es-ES");

              return (
                <div className="card-Product landing" key={producto.id}>
                  <img
                    src={urlImagen}
                    alt={producto.nombre_prod}
                    className="product-image"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="contain-body-Product">
                    <h3 className="title-Product">{producto.nombre_prod}</h3>
                    <p className="description-product">
                      {producto.description}
                    </p>
                  </div>
                  <div className="contain-actions">
                    <p className="price-Product">${precioFormateado}</p>
                    <Button
                      className="add-Product"
                      onClick={() => handleViewProduct(producto)}
                    >
                      <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                      Añadir al carrito
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>

        <div ref={drinksRef} style={{ padding: "50px 0 180px 0" }}>
          <h2 className="title-section-menu">Bebidas</h2>
          {/* Contenido de "Bebidas" */}
          {productos
            .filter((producto) => producto.category === "BEBIDAS")
            .map((producto) => {
              const urlImagen = obtenerURLImagen(
                producto.image_url
              )?.toString(); // Generar URL de la imagen
              const precioFormateado =
                producto.precio_prod.toLocaleString("es-ES");

              return (
                <div className="card-Product landing" key={producto.id}>
                  <img
                    src={urlImagen}
                    alt={producto.nombre_prod}
                    className="product-image"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="contain-body-Product">
                    <h3 className="title-Product">{producto.nombre_prod}</h3>
                    <p className="description-product">
                      {producto.description}
                    </p>
                  </div>
                  <div className="contain-actions">
                    <p className="price-Product">${precioFormateado}</p>
                    <Button
                      className="add-Product"
                      onClick={() => handleViewProduct(producto)}
                    >
                      <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                      Añadir al carrito
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Mostrar el componente solo si hay productos en el carrito */}
      {totalProductos > 0 && (
        <div className="shopping-card-modal flex"
        style={{
          bottom: isSticky ? "80px" : "20px",
        }}
        >
          <div className="info-order block">
            <h4 className="cant-Product">
              <span>{totalProductos}</span> producto
              {totalProductos > 1 ? "s" : ""}
            </h4>
            <p className="price-Product">
              ${totalCarrito.toLocaleString("es-ES")}
            </p>
          </div>
          <Button
            className="view-Product-Order"
            onClick={() => navigate("/cart")}
          >
            Ver Carrito
          </Button>
        </div>
      )}

      {/* Footer */}
      <Footer
        ref={footerRef}
        className="footer-Custom"
        style={{
          textAlign: "center",
          backgroundColor: "#393844",
          color: "white",
          position: "absolute",
            bottom: "0",
            width: "640px"
        }}
      >
        ©2024 Brunette. Todos los derechos reservados.
      </Footer>
    </Layout>
  );
};

export default LandingPage;
