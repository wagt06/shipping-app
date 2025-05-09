import React from "react"
// Puedes agregar aquí tu menú de encuestador, header, etc.

const EncuestadorLayout = ({ children, user, setThemeMode, themeMode }) => (
  <div>
    {/* Header/Encuestador Nav */}
    <header style={{ padding: 16, background: "#e6f7ff" }}>
      <h2>Panel Encuestador</h2>
      <span>Usuario: {user?.name || "Encuestador"}</span>
      {/* Puedes agregar botones de logout, cambio de tema, etc */}
    </header>
    <main style={{ padding: 24 }}>
      {children}
    </main>
  </div>
)

export default EncuestadorLayout
