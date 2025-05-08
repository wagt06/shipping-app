"use client"

import { useState } from "react"
import {
  Card,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Badge,
  Space,
  Empty,
  Tooltip,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  QuestionOutlined,
} from "../components/ui"
import { format } from "date-fns"

const { Title, Text, Paragraph } = Typography

export default function SurveyList({ surveys, userRole, onEdit, onAnswer, onViewResults, onDelete, responses }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar encuestas por término de búsqueda
  const filteredSurveys = surveys.filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Obtener el número de respuestas para cada encuesta
  const getResponseCount = (surveyId) => {
    return responses.filter((response) => response.surveyId === surveyId).length
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return format(new Date(dateString), "PPP")
  }

  // Obtener el color del estado para el badge
  const getStatusColor = (count) => {
    if (count === 0) return "default"
    if (count < 5) return "processing"
    if (count < 10) return "warning"
    return "success"
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Encuestas Disponibles</Title>
        <Input
          placeholder="Buscar encuestas..."
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredSurveys.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            searchTerm
              ? "No se encontraron encuestas que coincidan con tu búsqueda."
              : "No hay encuestas disponibles. Crea una nueva encuesta para comenzar."
          }
        >
          {userRole === "admin" && !searchTerm && (
            <Button type="primary" onClick={() => document.querySelector('button[type="primary"]').click()}>
              Crear Encuesta
            </Button>
          )}
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredSurveys.map((survey) => (
            <Col xs={24} sm={12} lg={8} key={survey.id}>
              <Card
                title={survey.title}
                extra={
                  <Badge
                    count={getResponseCount(survey.id)}
                    showZero
                    overflowCount={99}
                    status={getStatusColor(getResponseCount(survey.id))}
                  />
                }
                actions={
                  userRole === "admin"
                    ? [
                        <Tooltip title="Editar" key="edit">
                          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(survey)} />
                        </Tooltip>,
                        <Tooltip title="Ver resultados" key="results">
                          <Button type="text" icon={<EyeOutlined />} onClick={() => onViewResults(survey)} />
                        </Tooltip>,
                        <Tooltip title="Eliminar" key="delete">
                          <Button type="text" icon={<DeleteOutlined />} onClick={() => onDelete(survey.id)} />
                        </Tooltip>,
                      ]
                    : [
                        <Button type="primary" key="answer" onClick={() => onAnswer(survey)}>
                          Responder
                        </Button>,
                      ]
                }
              >
                <Paragraph ellipsis={{ rows: 2 }}>{survey.description}</Paragraph>
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  <Text type="secondary">
                    <CalendarOutlined /> Creada: {formatDate(survey.createdAt)}
                  </Text>
                  <Text type="secondary">
                    <UserOutlined /> {getResponseCount(survey.id)} respuestas
                  </Text>
                  <Text type="secondary">
                    <QuestionOutlined /> {survey.questions.length}{" "}
                    {survey.questions.length === 1 ? "pregunta" : "preguntas"}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
