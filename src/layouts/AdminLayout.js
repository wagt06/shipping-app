import React from "react"
// Puedes agregar aquí tu menú de admin, header, etc.

const AdminLayout = ({ children, user, setThemeMode, themeMode }) => (
  <div>
    {/* Header/Admin Nav */}
    <header style={{ padding: 16, background: "#f0f2f5" }}>
      <h2>Panel Administrador</h2>
      <span>Usuario: {user?.name || "Admin"}</span>
      {/* Puedes agregar botones de logout, cambio de tema, etc */}
    </header>
    <main style={{ padding: 24 }}>
      {children}
    </main>
  </div>
)

export default AdminLayout
