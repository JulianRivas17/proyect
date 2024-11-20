// src/components/public/LandingPage.tsx
// src/components/public/LandingPage.tsx
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Menu, Layout, Button, Carousel, Input } from 'antd';
import { InstagramOutlined, FacebookOutlined, EnvironmentOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './landing.css';
import iconBrunnete from '../../assets/images/cocinero.png';

const { Content, Footer } = Layout;
const { Meta } = Card;

const LandingPage: React.FC = () => {
    // Define los refs para cada sección
    const mostSoldRef = useRef<HTMLDivElement>(null);
    const combosRef = useRef<HTMLDivElement>(null);
    const specialsRef = useRef<HTMLDivElement>(null);
    const drinksRef = useRef<HTMLDivElement>(null);

    const [count, setCount] = useState(1);
  
    const handleIncrement = () => {
      setCount(count + 1);
    };
  
    const handleDecrement = () => {
      if (count > 1) {
        setCount(count - 1);
      }
    };

    // Función para hacer scroll a una sección
    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const navigate = useNavigate();

    const handleViewProduct = () => {
        navigate('/viewProduct'); // Navega a la página viewProduct
    };

    const handleCart = () => {
        navigate('/cart'); // Navega a la página Cart
    };


    return (
        <Layout className="container-principal">
            {/*Header y Banner principal*/}
            <div className="container-banner"></div>

            {/* Menú de navegación */}
            <div className="categories-tab" >
                <div className="contain-banner-flex">
                    <div className="contain-logo">
                        <img className="icon-logo-brunnete" src={iconBrunnete} alt="" />
                        <h1>Resto Brunette</h1>
                    </div>
                    <div className="contain-social-networking">
                        <Button className='item-social-network' type="primary" icon={<InstagramOutlined />}></Button>
                        <Button className='item-social-network' type="primary" icon={<FacebookOutlined />}></Button>
                        <Button className='item-social-network' type="primary" icon={<EnvironmentOutlined />}></Button>
                    </div>
                </div>
                <Menu mode="horizontal" theme="dark" className="contain-menu" style={{ justifyContent: 'left' }}>
                    <Menu.Item onClick={() => scrollToSection(mostSoldRef)}>Platos especiales</Menu.Item>
                    <Menu.Item onClick={() => scrollToSection(combosRef)}>Combos</Menu.Item>
                    <Menu.Item onClick={() => scrollToSection(specialsRef)}>Principales</Menu.Item>
                    <Menu.Item onClick={() => scrollToSection(drinksRef)}>Bebidas</Menu.Item>
                </Menu>
            </div>

            {/* Contenido de las secciones */}
            <div className="Content-products" style={{ padding: '10px' }}>
                <div ref={mostSoldRef} style={{ padding: '20px 0px 0px 0px' }}>
                    <h2 className="title-section-menu">Platos especiales</h2>
                    {/* Contenido de "Lo más vendido" */}

                    <Carousel autoplay>
                        {/*Esta dividido cada 3 imágenes (como máximo), faltaria hacer que cada 3 se genere un div contain-product-mostSold*/}
                        <div className="contain-product-mostSold">
                            <div className="container-carousel">
                                <Card className="card-Custom" 
                                    hoverable
                                    style={{ width: 200, background: '#2d2c36'}}
                                    cover={<img className="img-Product" alt="example" src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" height="100px"/>}
                                >
                                    <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                                    <p className="price-Product">$7.000</p>
                                    <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                                </Card>
                                <Card className="card-Custom" 
                                    hoverable
                                    style={{ width: 200, background: '#2d2c36'}}
                                    cover={<img className="img-Product" alt="example" src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" height="100px"/>}
                                >
                                    <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                                    <p className="price-Product">$7.000</p>
                                    <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                                </Card>
                                <Card className="card-Custom" 
                                    hoverable
                                    style={{ width: 200, background: '#2d2c36'}}
                                    cover={<img className="img-Product" alt="example" src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" height="100px"/>}
                                >
                                    <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                                    <p className="price-Product">$7.000</p>
                                    <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                                </Card>
                            </div>
                        </div>
                        <div className="contain-product-mostSold">
                            <div className="container-carousel">
                                <Card className="card-Custom" 
                                    hoverable
                                    style={{ width: 200, background: '#2d2c36'}}
                                    cover={<img className="img-Product" alt="example" src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" height="100px"/>}
                                >
                                    <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                                    <p className="price-Product">$7.000</p>
                                    <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                                </Card>
                                <Card className="card-Custom" 
                                    hoverable
                                    style={{ width: 200, background: '#2d2c36'}}
                                    cover={<img className="img-Product" alt="example" src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" height="100px"/>}
                                >
                                    <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                                    <p className="price-Product">$7.000</p>
                                    <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                                </Card>
                                <Card className="card-Custom" 
                                    hoverable
                                    style={{ width: 200, background: '#2d2c36'}}
                                    cover={<img className="img-Product" alt="example" src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" height="100px"/>}
                                >
                                    <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                                    <p className="price-Product">$7.000</p>
                                    <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                                </Card>
                            </div>
                        </div>
                    </Carousel>
                </div>

                <div ref={combosRef} style={{ padding: '20px 0px 50px 0px' }}>
                    <h2 className="title-section-menu">Combos</h2>
                    {/* Contenido de "Combos" */}
                    <div className="card-Product">
                        <img src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" alt="" />
                        <div className="contain-body-Product">
                            <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                            <p className="description-product">CARNE SMASHEADA, CHEDDAR, CEBOLLA, KETCHUP, MOSTAZA Y PAN DE PAPA. INCLUYE PAPAS FRITAS</p>
                        </div>
                        <div className="contain-actions">
                            <p className="price-Product">$7.000</p>
                            <Button 
                            className="add-Product"
                            onClick={handleViewProduct} 
                            ><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                        </div>
                    </div>
                    <div className="card-Product">
                        <img src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" alt="" />
                        <div className="contain-body-Product">
                            <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                            <p className="description-product">CARNE SMASHEADA, CHEDDAR, CEBOLLA, KETCHUP, MOSTAZA Y PAN DE PAPA. INCLUYE PAPAS FRITAS</p>
                        </div>
                        <div className="contain-actions">
                            <p className="price-Product">$7.000</p>
                            <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                        </div>
                    </div>
                </div>

                <div ref={specialsRef}>
                    <h2 className="title-section-menu">Principales</h2>
                    {/* Contenido de "Especiales" */}
                    <div className="card-Product">
                        <img src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" alt="" />
                        <div className="contain-body-Product">
                            <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                            <p className="description-product">CARNE SMASHEADA, CHEDDAR, CEBOLLA, KETCHUP, MOSTAZA Y PAN DE PAPA. INCLUYE PAPAS FRITAS</p>
                        </div>
                        <div className="contain-actions">
                            <p className="price-Product">$7.000</p>
                            <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                        </div>
                    </div>
                    <div className="card-Product">
                        <img src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" alt="" />
                        <div className="contain-body-Product">
                            <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                            <p className="description-product">CARNE SMASHEADA, CHEDDAR, CEBOLLA, KETCHUP, MOSTAZA Y PAN DE PAPA. INCLUYE PAPAS FRITAS</p>
                        </div>
                        <div className="contain-actions">
                            <p className="price-Product">$7.000</p>
                            <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                        </div>
                    </div>
                </div>

                <div ref={drinksRef} style={{ padding: '50px 0' }}>
                    <h2 className="title-section-menu">Bebidas</h2>
                    {/* Contenido de "Bebidas" */}
                    <div className="card-Product">
                        <img src="https://dcdn.mitiendanube.com/stores/005/110/462/products/coca-original-500ml-6-ef15633e536178b0e717284020274998-1024-1024.png" alt="" />
                        <div className="contain-body-Product">
                            <h3 className="title-Product">Coca Cola Común</h3>
                            <p className="description-product">500ml</p>
                        </div>
                        <div className="contain-actions">
                            <p className="price-Product">$2.500</p>
                            <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                        </div>
                    </div>
                    <div className="card-Product">
                        <img src="https://jumboargentina.vtexassets.com/arquivos/ids/799868/Gaseosa-Coca-Cola-Zero-X-500-Cc-2-19760.jpg?v=638349573654170000" alt="" />
                        <div className="contain-body-Product">
                            <h3 className="title-Product">Coca Cola Zero</h3>
                            <p className="description-product">500ml</p>
                        </div>
                        <div className="contain-actions">
                            <p className="price-Product">$2.500</p>
                            <Button className="add-Product"><ShoppingCartOutlined style={{ fontSize: '20px'}}/>Añadir al carrito</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="shopping-card-modal flex">
                <div className="info-order block">
                    <h4 className="cant-Product"><span>1</span> producto</h4>
                    <p className="price-Product">$7.000</p>
                </div>
                <Button className="view-Product-Order"
                 onClick={handleCart}  
                 >Ver Carrito</Button>
            </div>

            {/* Footer */}
            <Footer style={{ textAlign: 'center', backgroundColor: '#393844', color: 'white' }}>©2024 Brunette. Todos los derechos reservados.</Footer>
        </Layout>
    );
};


export default LandingPage;