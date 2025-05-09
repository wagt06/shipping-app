import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ConfigProvider } from "antd"
import esES from "antd/lib/locale/es_ES"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import PublicLayout from "./layouts/PublicLayout"
import EncuestaPage from "./pages/EncuestaPage"
import LandingPage from "./pages/LandingPage"

function App() {
  const [themeMode, setThemeMode] = useState("light") // light o dark
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUserRole] = useState(null) // null si no está logeado

  // Recuperar autenticación y usuario de localStorage al iniciar la app
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setIsAuthenticated(true)
      setUserRole(JSON.parse(storedUser))
    }

  }, [])

  // Configuración del tema dinámico
  const theme = {
    token: {
      colorPrimary: themeMode === "light" ? "#1677ff" : "#1d39c4",
      colorBgBase: themeMode === "light" ? "#ffffff" : "#141414",
      colorTextBase: themeMode === "light" ? "#000000" : "#ffffff",
      borderRadius: 3,
    },
  }

  return (
    <ConfigProvider locale={esES} theme={theme}>
      <Routes>
        {/* Ruta pública para ver encuestas por link */}
        <Route path="/encuesta/:id" element={<PublicLayout><EncuestaPage /></PublicLayout>} />
        {!isAuthenticated ? (
          <Route path="/" />
        ) : user?.role === "admin" ? (
          <Route path="/*" element={<HomePage user={user} setThemeMode={setThemeMode} themeMode={themeMode} />} />
        ) : user?.role === "encuestador" ? (
          <Route path="/*" element={<HomePage user={user} setThemeMode={setThemeMode} themeMode={themeMode} />} />
        ) : (
          <Route path="/" element={<HomePage setThemeMode={setThemeMode} themeMode={themeMode} user={user} />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />

         <Route path="/login" element={<LoginPage></LoginPage>} />
         <Route path="/index" element={<LandingPage></LandingPage>} />
         
      </Routes>

      
    </ConfigProvider>
  )
}

export default App
