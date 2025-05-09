import React,{useState} from "react"
import { Button,Layout, Space,Image } from "antd"
import { UserOutlined, FormOutlined, MoonOutlined,SunOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
// Puedes agregar aquí tu menú de admin, header, etc.
const { Header, Content } = Layout


const MenuPrincipal = ({user,themeMode,currentView,setCurrentView,setThemeMode,handleCreateSurvey}) =>{

 const navigate = useNavigate()

  const toggleTheme = () => {
    const newTheme = themeMode === "light" ? "dark" : "light"
    setThemeMode(newTheme)
    document.body.className = newTheme // Cambia la clase del body para aplicar estilos globales
  }

  const logout = () => {
    localStorage.removeItem("user") // Elimina el usuario del localStorage
    navigate("/login")
  }

return (
    

    <Header className="site-header  sticky-top">
        <div className="d-flex justify-content-between align-content-center ">
          <Image src="/burbuja-de-dialogo.png" alt="Logo"  style={{width:"30px", height:"30px"}} />
          <div className="fs-5 text-white ms-2 me-auto" onClick={() => setCurrentView("list")} style={{ cursor: "pointer" }}>
              ED69
          </div> 
          <Space>
             <div className="d-flex align-items-center text-white">
              <UserOutlined className="me-2" />
              Hola! {user.username}
            </div>
            {user.role === "admin" && currentView === "list" && (
              <Button type="primary" onClick={handleCreateSurvey} icon={<FormOutlined />}>
              Encuesta
              </Button>
            )}
            <Button type="default" variant="outlined" onClick={toggleTheme} >
               {themeMode === "light" ? <SunOutlined /> :  <MoonOutlined/>}
            </Button>
            <Button type="default" variant="outlined" onClick={logout} >
               Cerrar sesión
            </Button>
          </Space>
        </div>
      </Header>
)
}
export default MenuPrincipal
