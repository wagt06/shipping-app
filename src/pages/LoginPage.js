import { useState } from "react"
import { Button, Form, Input, Alert, Image } from "antd"
import { loginService } from "../services/authService"
import { useNavigate } from "react-router-dom"
import { useLocalStorage } from "../hooks/useLocalStorage"

function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [, setUser] = useLocalStorage("user", null)

  const handleLogin = async (values) => {
    setLoading(true)
    setError(null)
    const { username, password } = values

    try {
      const auth = await loginService(username, password)
      if (auth) {
        setUser(auth)
        //onLoginSuccess(auth)
        navigate("/")
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
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="card login-container p-3" style={{ width: 400 }}>
        {error && <Alert message={error} type="error" showIcon />}

        <div className="w-100 text-center">
          <Image
            width={100}
            src="./burbuja-de-dialogo.png"
            alt="Logo"
            style={{ marginBottom: 10 }}
            preview={false}
          ></Image>
          <h4>
            Bienvenido <strong>FeedBack</strong>
          </h4>
          <p className="fs-5">Inicia sesión para continuar</p>
        </div>

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
    </div>
  )
}

export default LoginPage