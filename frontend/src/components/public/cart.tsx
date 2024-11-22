import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Menu, Layout, Button, Carousel, Input } from 'antd';
import { InstagramOutlined, FacebookOutlined, EnvironmentOutlined,LeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './landing.css';
import iconBrunnete from '../../assets/images/cocinero.png';

const { Content, Footer } = Layout;
const { Meta } = Card;

const Cart: React.FC = () => {
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

             {/* Carrito */}
             <Button 
                    className="return-page custom"
                    onClick={handleLandingPage}  
                    type="primary" icon={<LeftOutlined />}>
              </Button>
             <div className="card-Product border">
                <img src="https://www.clarin.com/2022/05/27/0HXb0UR0v_2000x1500__1.jpg" alt="Hamburguesa Cuarto de Teca" />
                <div className="contain-body-Product">
                    <h3 className="title-Product">Hamburguesa Cuarto de Teca <span style={{textTransform:'lowercase'}}>(x1)</span></h3>
                    <p className="description-product">
                        CARNE SMASHEADA, CHEDDAR, CEBOLLA, KETCHUP, MOSTAZA Y PAN DE PAPA. INCLUYE PAPAS FRITAS
                    </p>
                </div>
                <div className="contain-actions">
                    <p className="price-Product">$7.000</p>
                    <div className="actions">
                        <Button className='btn-edit' type="primary" icon={<EditOutlined />} style={{backgroundColor:'orange'}}></Button>
                        <Button className='btn-delete' type="primary" danger icon={<DeleteOutlined />}></Button>
                    </div>
                </div>
            </div>
            
            

            <div className="shopping-card-modal custom-m">
                <div className="info-order">
                    <h2 className="title-section-order">Total</h2>
                    <p className="price-Product">$7.000</p>
                </div>
                <div className="add-order flex">
                    <Button className="add-more-product">Agregar más productos</Button>
                    <Button className="add-order-btn">Hacer Pedido</Button>
                </div>
            </div>

            {/* Footer */}
            <Footer className="footer-Custom" style={{ textAlign: 'center', backgroundColor: '#393844', color: 'white' }}>©2024 Brunette. Todos los derechos reservados.</Footer>
        </Layout>
    );
};


export default Cart;