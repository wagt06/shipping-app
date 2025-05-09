import React from "react"

const PublicLayout = ({ children }) => (
  <div>
    <header style={{ padding: 16, background: "#fafafa" }}>
      <h2>Encuesta</h2>
    </header>
    <main style={{ padding: 24 }}>
      {children}
    </main>
  </div>
)

export default PublicLayout
