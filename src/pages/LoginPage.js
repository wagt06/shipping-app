import { useState } from "react"
import { Button, Form, Input, Alert } from "antd"
import { loginService } from "../services/authService"

function LoginPage({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (values) => {
    setLoading(true)
    setError(null)
    const { username, password } = values

    try {
      const isAuthenticated = await loginService(username, password)
      if (isAuthenticated) {
        onLoginSuccess()
      } else {
        setError("Credenciales inválidas. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container" style={{ maxWidth: 300, margin: "50px auto" }}>
      <h2>Iniciar Sesión</h2>
      {error && <Alert message={error} type="error" showIcon />}
      <Form layout="vertical" onFinish={handleLogin}>
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
        >
          <Input placeholder="Usuario" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
        >
          <Input.Password placeholder="Contraseña" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginPage