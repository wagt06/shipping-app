import { ConfigProvider } from "antd"
import esES from "antd/lib/locale/es_ES"
import { theme } from "./theme"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ConfigProvider locale={esES} theme={theme}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
