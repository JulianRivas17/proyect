import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Menu, Layout, Button, Carousel, Input } from 'antd';
import { InstagramOutlined, FacebookOutlined, EnvironmentOutlined,LeftOutlined } from '@ant-design/icons';
import './landing.css';
import iconBrunnete from '../../assets/images/cocinero.png';

const { Content, Footer } = Layout;
const { Meta } = Card;

const ViewProduct: React.FC = () => {
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

    const handleLandingPage = () => {
        navigate('/landing'); // Navega a la página viewProduct
    };

    return (
        <Layout className="container-principal">
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
            </div>

            {/* Info del Producto */}
            <div className="container-info-product">
                <div className="img-product">
                    <Button 
                        className="return-page"
                        onClick={handleLandingPage}  
                        type="primary" icon={<LeftOutlined />}></Button>
                    <img className="img-product-custom" src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" alt=""/>
                </div>
                <div className="info-product-selected">
                     <div className="contain-body-Product">
                        <h3 className="title-Product">Hamburguesa Cuarto de Teca</h3>
                        <p className="description-product">CARNE SMASHEADA, CHEDDAR, CEBOLLA, KETCHUP, MOSTAZA Y PAN DE PAPA. INCLUYE PAPAS FRITAS</p>
                    </div>
                    <div className="contain-actions custom">
                        <p className="price-Product">$7.000</p>
                    </div>

                </div>
            </div>
            

            <div className="shopping-card-modal">
                <div className="info-order">
                    <h2 className="title-section-order">Tu pedido</h2>
                    <p className="price-Product">$7.000</p>
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
                        <Input
                            value={count}
                            readOnly
                            className="counter-input"
                        />
                        <Button
                            type="text"
                            onClick={handleIncrement}
                            className="counter-button"
                        >
                            +
                        </Button>
                    </div>
                    <Button className="add-Product-Order"
                    onClick={handleLandingPage}  
                    >Agregar</Button>
                </div>
            </div>

            {/* Footer */}
            <Footer className="footer-Custom" style={{ textAlign: 'center', backgroundColor: '#393844', color: 'white' }}>©2024 Brunette. Todos los derechos reservados.</Footer>
        </Layout>
    );
};


export default ViewProduct;