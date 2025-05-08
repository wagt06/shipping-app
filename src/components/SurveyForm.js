"use client"

import { useState, useEffect } from "react"
import { Card, Input, Button, Form, Checkbox, Radio, DatePicker, InputNumber, Typography, Alert, Space } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Title, Text } = Typography
const { Group: RadioGroup } = Radio
const { Group: CheckboxGroup } = Checkbox

function SurveyForm({ survey, response, onSubmit }) {
  const [currentResponse, setCurrentResponse] = useState(response)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form] = Form.useForm()

  // Inicializar respuestas vacías para todas las preguntas
  useEffect(() => {
    // Only initialize answers if they don't exist yet
    const initialAnswers = {}
    let needsUpdate = false

    survey.questions.forEach((question) => {
      if (!currentResponse.answers[question.id]) {
        needsUpdate = true
        if (question.type === "multiple") {
          initialAnswers[question.id] = []
        } else {
          initialAnswers[question.id] = ""
        }
      }
    })

    // Only update state if we have new answers to initialize
    if (needsUpdate) {
      setCurrentResponse({
        ...currentResponse,
        answers: { ...currentResponse.answers, ...initialAnswers },
      })
    }
  }, [survey.questions, survey.id]) // Only run when questions or survey ID changes

  // Manejar cambios en las respuestas de texto, número y fecha
  const handleInputChange = (questionId, value) => {
    setCurrentResponse({
      ...currentResponse,
      answers: {
        ...currentResponse.answers,
        [questionId]: value,
      },
    })

    // Limpiar error si existe
    if (errors[questionId]) {
      setErrors({
        ...errors,
        [questionId]: null,
      })
    }
  }

  // Manejar cambios en las respuestas de selección única
  const handleSingleSelectChange = (questionId, value) => {
    setCurrentResponse({
      ...currentResponse,
      answers: {
        ...currentResponse.answers,
        [questionId]: value,
      },
    })

    // Limpiar error si existe
    if (errors[questionId]) {
      setErrors({
        ...errors,
        [questionId]: null,
      })
    }
  }

  // Manejar cambios en las respuestas de selección múltiple
  const handleMultipleSelectChange = (questionId, checkedValues) => {
    setCurrentResponse({
      ...currentResponse,
      answers: {
        ...currentResponse.answers,
        [questionId]: checkedValues,
      },
    })

    // Limpiar error si existe
    if (errors[questionId]) {
      setErrors({
        ...errors,
        [questionId]: null,
      })
    }
  }

  // Validar el formulario antes de enviar
  const validateForm = () => {
    const newErrors = {}

    survey.questions.forEach((question) => {
      if (question.required) {
        const answer = currentResponse.answers[question.id]

        if (question.type === "multiple") {
          if (!answer || answer.length === 0) {
            newErrors[question.id] = "Esta pregunta es obligatoria"
          }
        } else {
          if (!answer || (typeof answer === "string" && answer.trim() === "")) {
            newErrors[question.id] = "Esta pregunta es obligatoria"
          }
        }
      }

      // Validar preguntas numéricas
      if (question.type === "number" && currentResponse.answers[question.id]) {
        const numValue = Number.parseFloat(currentResponse.answers[question.id])

        if (isNaN(numValue)) {
          newErrors[question.id] = "Debe ingresar un número válido"
        } else {
          if (question.min !== undefined && question.min !== "" && numValue < Number.parseFloat(question.min)) {
            newErrors[question.id] = `El valor mínimo es ${question.min}`
          }
          if (question.max !== undefined && question.max !== "" && numValue > Number.parseFloat(question.max)) {
            newErrors[question.id] = `El valor máximo es ${question.max}`
          }
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar el envío del formulario
  const handleSubmit = (e) => {

    if (validateForm()) {
      setIsSubmitting(true)
      onSubmit(currentResponse)
    } else {
      // Desplazarse al primer error
      const firstErrorKey = Object.keys(errors)[0]
      if (firstErrorKey) {
        const element = document.getElementById(`question-${firstErrorKey}`)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    }
  }

  // Renderizar un campo según el tipo de pregunta
  const renderQuestionField = (question) => {
    const { id, type, title, options = [], required } = question
    const value = currentResponse.answers[id] || ""
    const error = errors[id]

    switch (type) {
      case "text":
        return (
          <Form.Item validateStatus={error ? "error" : ""} help={error}>
            <TextArea
              id={`question-${id}`}
              value={value}
              onChange={(e) => handleInputChange(id, e.target.value)}
              placeholder="Tu respuesta"
              rows={4}
            />
          </Form.Item>
        )

      case "number":
        return (
          <Form.Item validateStatus={error ? "error" : ""} help={error}>
            <InputNumber
              id={`question-${id}`}
              value={value}
              onChange={(value) => handleInputChange(id, value)}
              placeholder="Tu respuesta"
              min={question.min}
              max={question.max}
              style={{ width: "100%" }}
            />
          </Form.Item>
        )

      case "date":
        return (
          <Form.Item validateStatus={error ? "error" : ""} help={error}>
            <DatePicker
              id={`question-${id}`}
              value={value ? new Date(value) : null}
              onChange={(date, dateString) => handleInputChange(id, dateString)}
              style={{ width: "100%" }}
            />
          </Form.Item>
        )

      case "single":
        return (
          <Form.Item validateStatus={error ? "error" : ""} help={error}>
            <RadioGroup value={value} onChange={(e) => handleSingleSelectChange(id, e.target.value)}>
              <Space direction="vertical">
                {options.map((option) => (
                  <Radio key={option.id} value={option.id}>
                    {option.text}
                  </Radio>
                ))}
              </Space>
            </RadioGroup>
          </Form.Item>
        )

      case "multiple":
        return (
          <Form.Item validateStatus={error ? "error" : ""} help={error}>
            <CheckboxGroup value={value} onChange={(checkedValues) => handleMultipleSelectChange(id, checkedValues)}>
              <Space direction="vertical">
                {options.map((option) => (
                  <Checkbox key={option.id} value={option.id}>
                    {option.text}
                  </Checkbox>
                ))}
              </Space>
            </CheckboxGroup>
          </Form.Item>
        )

      default:
        return <Text type="danger">Tipo de pregunta no soportado: {type}</Text>
    }
  }

  return (
    <Card title={survey.title}>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        {survey.description}
      </Text>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {survey.questions.length === 0 ? (
          <Alert
            message="No hay preguntas"
            description="Esta encuesta no tiene preguntas."
            type="info"
            showIcon
            icon={<QuestionCircleOutlined />}
          />
        ) : (
          survey.questions.map((question, index) => (
            <div key={question.id} className="mb-6" id={`question-${question.id}`}>
              <Form.Item
                label={
                  <Text strong>
                    {index + 1}. {question.title}
                    {question.required && <span className="required-mark">*</span>}
                  </Text>
                }
              >
                {renderQuestionField(question)}
              </Form.Item>
            </div>
          ))
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isSubmitting || survey.questions.length === 0}
            loading={isSubmitting}
            block
          >
            Enviar Respuestas
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default SurveyForm
