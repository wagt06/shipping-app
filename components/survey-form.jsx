"use client"

import { useState, useEffect } from "react"
import { Card, Form, Input, Button, Checkbox, Radio, DatePicker, InputNumber, Typography, Alert } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Title, Text } = Typography

export default function SurveyForm({ survey, response, onSubmit }) {
  const [currentResponse, setCurrentResponse] = useState(response)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form] = Form.useForm()

  // Initialize form with empty answers
  useEffect(() => {
    const initialValues = {}

    survey.questions.forEach((question) => {
      if (!currentResponse.answers[question.id]) {
        if (question.type === "multiple") {
          initialValues[question.id] = []
        } else {
          initialValues[question.id] = undefined
        }
      } else {
        initialValues[question.id] = currentResponse.answers[question.id]
      }
    })

    form.setFieldsValue(initialValues)
  }, [survey.id, form])

  const handleFinish = (values) => {
    setIsSubmitting(true)

    const updatedResponse = {
      ...currentResponse,
      answers: values,
    }

    onSubmit(updatedResponse)
  }

  return (
    <Card title={survey.title}>
      <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
        {survey.description}
      </Text>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
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
            <Form.Item
              key={question.id}
              name={question.id}
              label={
                <Text strong>
                  {index + 1}. {question.title}
                  {question.required && <span style={{ color: "#ff4d4f", marginLeft: 4 }}>*</span>}
                </Text>
              }
              rules={[
                {
                  required: question.required,
                  message: "Esta pregunta es obligatoria",
                },
              ]}
            >
              {question.type === "text" && <TextArea rows={4} placeholder="Tu respuesta" />}

              {question.type === "number" && (
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Tu respuesta"
                  min={question.min}
                  max={question.max}
                />
              )}

              {question.type === "date" && <DatePicker style={{ width: "100%" }} />}

              {question.type === "single" && (
                <Radio.Group>
                  {question.options?.map((option) => (
                    <Radio key={option.id} value={option.id} style={{ display: "block", marginBottom: 8 }}>
                      {option.text}
                    </Radio>
                  ))}
                </Radio.Group>
              )}

              {question.type === "multiple" && (
                <Checkbox.Group>
                  {question.options?.map((option) => (
                    <Checkbox key={option.id} value={option.id} style={{ display: "block", marginBottom: 8 }}>
                      {option.text}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}
            </Form.Item>
          ))
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={survey.questions.length === 0}
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
