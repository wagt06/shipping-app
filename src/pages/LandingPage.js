import React, { useState } from "react"
import { Button, Card, Row, Col, Typography, Carousel, Avatar, List, Anchor, Layout, Drawer } from "antd"
import { MenuOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const { Title, Paragraph } = Typography
const { Footer } = Layout

const companies = [
    { name: "Empresa A", logo: "https://via.placeholder.com/80x40?text=Empresa+A" },
    { name: "Empresa B", logo: "https://via.placeholder.com/80x40?text=Empresa+B" },
    { name: "Empresa C", logo: "https://via.placeholder.com/80x40?text=Empresa+C" },
    { name: "Empresa D", logo: "https://via.placeholder.com/80x40?text=Empresa+D" },
]

const plans = [
    { title: "Gratis", price: "$0", features: ["1 encuesta activa", "10 respuestas", "Soporte básico"] },
    { title: "Pro", price: "$19/mes", features: ["10 encuestas activas", "1000 respuestas", "Soporte prioritario"] },
    { title: "Empresarial", price: "A consultar", features: ["Ilimitado", "Integraciones", "Soporte dedicado"] },
]

const features = [
    { icon: "💬", title: "Encuestas Personalizadas", desc: "Crea encuestas a medida para tus necesidades." },
    { icon: "📊", title: "Resultados en Tiempo Real", desc: "Visualiza respuestas y estadísticas al instante." },
    { icon: "🔗", title: "Compartir Fácilmente", desc: "Envía encuestas por link, email o QR." },
    { icon: "🔒", title: "Seguridad", desc: "Tus datos y los de tus clientes siempre protegidos." },
]

const feedbacks = [
    { name: "Ana López", avatar: "", comment: "La plataforma es muy fácil de usar y me ayudó a mejorar el servicio a mis clientes." },
    { name: "Carlos Pérez", avatar: "", comment: "Excelente soporte y funcionalidades. ¡Muy recomendable!" },
    { name: "María García", avatar: "", comment: "Las estadísticas en tiempo real son geniales para tomar decisiones rápidas." },
]

const sections = [
    { key: "hero", label: "Inicio" },
    { key: "features", label: "Características" },
    { key: "companies", label: "Empresas" },
    { key: "plans", label: "Planes" },
    { key: "feedback", label: "Clientes" },
]

const backgroundStyle = {
    background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%) url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat",
    minHeight: "100vh",
    width: "100%",
    position: "relative",
}

const LandingPage = () => {
    const navigate = useNavigate()
    const [drawerVisible, setDrawerVisible] = useState(false)

    // Responsive menu: show drawer on mobile, horizontal on desktop
    const renderMenu = () => (
        <div className="d-flex align-items-center">
            <div className="d-none d-md-flex">
                {sections.map(s => (
                    <Button
                        key={s.key}
                        type="text"
                        style={{ fontWeight: 500, fontSize: 16, color: "#222", margin: "0 8px" }}
                        onClick={() => {
                            document.getElementById(s.key)?.scrollIntoView({ behavior: "smooth" })
                        }}
                    >
                        {s.label}
                    </Button>
                ))}
                     <Button
                            key={100}
                            type="primary"
                            block
                            onClick={() => {
                                setDrawerVisible(false)
                                setTimeout(() => {
                                    navigate("/login")
                                }, 200)
                            }}
                        >
                            Iniciar Sesión
                        </Button>
            </div>
            <Button
                className="d-md-none"
                type="text"
                icon={<MenuOutlined style={{ fontSize: 24 }} />}
                onClick={() => setDrawerVisible(true)}
                style={{ marginLeft: 8 }}
            />
            <Drawer
                placement="right"
                closable={false}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                bodyStyle={{ padding: 0 }}
                width={200}
            >
                <div style={{ padding: 24 }}>
                    {sections.map(s => (
                        <Button
                            key={s.key}
                            type="text"
                            block
                            style={{ fontWeight: 500, fontSize: 18, color: "#222", marginBottom: 16, textAlign: "left" }}
                            onClick={() => {
                                setDrawerVisible(false)
                                setTimeout(() => {
                                    document.getElementById(s.key)?.scrollIntoView({ behavior: "smooth" })
                                }, 200)
                            }}
                        >
                            {s.label}
                        </Button>
                    ))}

                 

                </div>
            </Drawer>
        </div>
    )

    return (
        <div style={backgroundStyle}>
            {/* Anchor Menu */}
            <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100, background: "#fff", borderBottom: "1px solid #eee" }}>
                <div className="container d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                        <img src="./burbuja-de-dialogo.png" alt="Logo" style={{ height: 40, marginRight: 12 }} />
                        <span style={{ fontWeight: 700, fontSize: 20 }}>FeedBack</span>
                    </div>
                    {renderMenu()}
                </div>
            </div>

            {/* Hero Section */}
            <div id="hero" className="container mt-5" >
                <div  className="row h-100">
                    <div className="col-6" style={{ height: "30em",backgroundImage: "url('/data-analytics-girl-working-computer-office-vector_116137-2554.jpg')",  backgroundSize: "contain",backgroundRepeat:"no-repeat", backgroundPosition: "left" }}></div>
                    <div className="col-6 ">
                        <div className="d-flex flex-column justify-content-center h-100" style={{ padding: "0 20px" }}>
                                    <Title>Bienvenido a FeedBack Encuestas</Title>
                                    <Paragraph>La forma más fácil y rápida de crear, enviar y analizar encuestas para tu empresa.</Paragraph>
                                    <div>
                                        <Button type="primary" size="large" className="mx-2" >Crear Cuenta</Button>
                                    <Button type="default" size="large" className="mx-2" >Ver Planes</Button>
                                    </div>
                                  
                        </div>
                          
                    </div>
                </div>
            </div>
           

            {/* Features Section */}
            <div id="features" className="container py-5" >
                <Title level={2} className="text-center mb-4">Características principales</Title>
                <Row gutter={[24, 24]} justify="center">
                    {features.map((f, idx) => (
                        <Col xs={24} sm={12} md={6} key={idx}>
                            <Card className="text-center">
                                <div style={{ fontSize: 36 }}>{f.icon}</div>
                                <Title level={4}>{f.title}</Title>
                                <Paragraph>{f.desc}</Paragraph>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Companies Section */}
            <div id="companies" className="container py-5 text-center">
                <Title level={3}>Empresas que confían en nosotros</Title>
                <Row gutter={[16, 16]} justify="center" align="middle">
                    {companies.map((c, idx) => (
                        <Col key={idx}>
                            <img src={c.logo} alt={c.name} style={{ maxHeight: 40, margin: "0 20px" }} />
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Plans Section */}
            <div id="plans" className="container py-5" >
                <Title level={2} className="text-center mb-4">Planes</Title>
                <Row gutter={[24, 24]} justify="center">
                    {plans.map((plan, idx) => (
                        <Col xs={24} sm={12} md={8} key={idx}>
                            <Card title={plan.title} bordered={false} className="text-center">
                                <Title level={3}>{plan.price}</Title>
                                <List
                                    size="small"
                                    dataSource={plan.features}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                                <Button type="primary" className="mt-3">Elegir</Button>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Client Feedback Section */}
            <div id="feedback" className="container py-5" >
                <Title level={2} className="text-center mb-4">Lo que dicen nuestros clientes</Title>
                <Carousel autoplay rows={1}>
                    {feedbacks.map((fb, idx) => (
                        <div key={idx}>
                            <Card className="mx-auto" style={{ maxWidth: 500 }}>
                                <div className="d-flex align-items-center mb-3">
                                    <Avatar size={48} style={{ backgroundColor: "#1677ff", marginRight: 16 }}>
                                        {fb.name[0]}
                                    </Avatar>
                                    <div>
                                        <strong>{fb.name}</strong>
                                    </div>
                                </div>
                                <Paragraph>"{fb.comment}"</Paragraph>
                            </Card>
                        </div>
                    ))}
                </Carousel>
            </div>

            {/* Footer */}
            <Footer style={{ background: "#222", color: "#fff", marginTop: 40, padding: "40px 0 20px 0" }}>
                <div className="container">
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <div className="d-flex align-items-center mb-2">
                                <img src="./burbuja-de-dialogo.png" alt="Logo" style={{ height: 32, marginRight: 10 }} />
                                <Title level={3} style={{ color: "#fff", margin: 0 }}>FeedBack</Title>
                            </div>
                            <Paragraph style={{ color: "#ccc" }}>
                                Plataforma de encuestas para empresas y profesionales. Mejora tu servicio y conoce la opinión de tus clientes.
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={8}>
                            <Title level={5} style={{ color: "#fff" }}>Información de la empresa</Title>
                            <Paragraph style={{ color: "#ccc", marginBottom: 0 }}>
                                Feedback Solutions S.A.S.<br />
                                Calle 123 #45-67, Bogotá, Colombia<br />
                                contacto@feedback.com<br />
                                +57 123 456 7890
                            </Paragraph>
                        </Col>
                        <Col xs={24} md={8}>
                            <Title level={5} style={{ color: "#fff" }}>Legal</Title>
                            <Paragraph style={{ color: "#ccc", marginBottom: 0 }}>
                                <a href="#" style={{ color: "#fff" }}>Términos y condiciones</a><br />
                                <a href="#" style={{ color: "#fff" }}>Política de privacidad</a>
                            </Paragraph>
                        </Col>
                    </Row>
                    <div className="text-center mt-4" style={{ color: "#aaa" }}>
                        © {new Date().getFullYear()} FeedBack Todos los derechos reservados.
                    </div>
                </div>
            </Footer>
        </div>
    )
}

export default LandingPage
