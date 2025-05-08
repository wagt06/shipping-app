import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { ConfigProvider } from "antd"
import esES from "antd/lib/locale/es_ES"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"

function App() {
  const [themeMode, setThemeMode] = useState("light") // light o dark
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Configuración del tema dinámico
  const theme = {
    token: {
      colorPrimary: themeMode === "light" ? "#1677ff" : "#1d39c4",
      colorBgBase: themeMode === "light" ? "#ffffff" : "#141414",
      colorTextBase: themeMode === "light" ? "#000000" : "#ffffff",
      borderRadius: 6,
    },
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  return (
    <ConfigProvider locale={esES} theme={theme}>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        ) : (
          <Route path="/" element={<HomePage setThemeMode={setThemeMode} themeMode={themeMode} />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfigProvider>
  )
}

export default App
