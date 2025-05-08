"use client"

import { useState } from "react"
import { Card, Form, Input, Button, Select, Checkbox, Alert, Typography } from "antd"
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Option } = Select
const { Title } = Typography

// Tipos de preguntas disponibles
const QUESTION_TYPES = [
  { id: "text", name: "Texto", icon: "📝" },
  { id: "single", name: "Selección Única", icon: "🔘" },
  { id: "multiple", name: "Selección Múltiple", icon: "☑️" },
  { id: "number", name: "Numérico", icon: "🔢" },
  { id: "date", name: "Fecha", icon: "📅" },
]

export default function SurveyEditor({ survey, onSave }) {
  const [currentSurvey, setCurrentSurvey] = useState(survey)
  const [form] = Form.useForm()

  // Manejar cambios en los datos básicos de la encuesta
  const handleSurveyChange = (e) => {
    const { name, value } = e.target
    setCurrentSurvey({
      ...currentSurvey,
      [name]: value,
      updatedAt: new Date().toISOString(),
    })
  }

  // Agregar una nueva pregunta
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      type: "text",
      title: "Nueva Pregunta",
      required: false,
      options: [],
    }

    setCurrentSurvey({
      ...currentSurvey,
      questions: [...currentSurvey.questions, newQuestion],
      updatedAt: new Date().toISOString(),
    })
  }

  // Eliminar una pregunta
  const handleDeleteQuestion = (questionId) => {
    setCurrentSurvey({
      ...currentSurvey,
      questions: currentSurvey.questions.filter((q) => q.id !== questionId),
      updatedAt: new Date().toISOString(),
    })
  }

  // Manejar cambios en una pregunta
  const handleQuestionChange = (questionId, field, value) => {
    setCurrentSurvey({
      ...currentSurvey,
      questions: currentSurvey.questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
      updatedAt: new Date().toISOString(),
    })
  }

  // Agregar una opción a una pregunta de selección
  const handleAddOption = (questionId) => {
    setCurrentSurvey({
      ...currentSurvey,
      questions: currentSurvey.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), { id: Date.now().toString(), text: "Nueva opción" }],
            }
          : q,
      ),
      updatedAt: new Date().toISOString(),
    })
  }

  // Eliminar una opción de una pregunta de selección
  const handleDeleteOption = (questionId, optionId) => {
    setCurrentSurvey({
      ...currentSurvey,
      questions: currentSurvey.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((opt) => opt.id !== optionId),
            }
          : q,
      ),
      updatedAt: new Date().toISOString(),
    })
  }

  // Manejar cambios en una opción
  const handleOptionChange = (questionId, optionId, value) => {
    setCurrentSurvey({
      ...currentSurvey,
      questions: currentSurvey.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) => (opt.id === optionId ? { ...opt, text: value } : opt)),
            }
          : q,
      ),
      updatedAt: new Date().toISOString(),
    })
  }

  // Guardar la encuesta
  const handleSaveSurvey = () => {
    // Validación básica
    if (!currentSurvey.title.trim()) {
      alert("El título de la encuesta es obligatorio")
      return
    }

    // Validar que las preguntas de selección tengan opciones
    for (const question of currentSurvey.questions) {
      if (!question.title.trim()) {
        alert("Todas las preguntas deben tener un título")
        return
      }

      if (
        (question.type === "single" || question.type === "multiple") &&
        (!question.options || question.options.length < 2)
      ) {
        alert("Las preguntas de selección deben tener al menos 2 opciones")
        return
      }
    }

    onSave(currentSurvey)
  }

  return (
    <div className="space-y-6">
      <Card title="Editar Encuesta">
        <Form layout="vertical">
          <Form.Item label="Título de la Encuesta" required>
            <Input name="title" value={currentSurvey.title} onChange={handleSurveyChange} />
          </Form.Item>
          <Form.Item label="Descripción">
            <TextArea name="description" value={currentSurvey.description} onChange={handleSurveyChange} rows={3} />
          </Form.Item>
        </Form>
      </Card>

      <div className="flex justify-between items-center">
        <Title level={4}>Preguntas</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion}>
          Agregar Pregunta
        </Button>
      </div>

      {currentSurvey.questions.length === 0 ? (
        <Alert
          message="No hay preguntas"
          description="Agrega preguntas a tu encuesta para comenzar."
          type="info"
          showIcon
        />
      ) : (
        <div className="space-y-4">
          {currentSurvey.questions.map((question, index) => (
            <Card
              key={question.id}
              title={`Pregunta ${index + 1}`}
              extra={<Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteQuestion(question.id)} />}
            >
              <Form layout="vertical">
                <Form.Item label="Título de la Pregunta" required>
                  <Input
                    value={question.title}
                    onChange={(e) => handleQuestionChange(question.id, "title", e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Tipo de Pregunta">
                  <Select
                    value={question.type}
                    onChange={(value) => handleQuestionChange(question.id, "type", value)}
                    style={{ width: "100%" }}
                  >
                    {QUESTION_TYPES.map((type) => (
                      <Option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Checkbox
                    checked={question.required}
                    onChange={(e) => handleQuestionChange(question.id, "required", e.target.checked)}
                  >
                    Pregunta obligatoria
                  </Checkbox>
                </Form.Item>

                {/* Opciones para preguntas de selección única o múltiple */}
                {(question.type === "single" || question.type === "multiple") && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Opciones</span>
                      <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => handleAddOption(question.id)}
                      >
                        Agregar Opción
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {question.options?.map((option) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <Input
                            value={option.text}
                            onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteOption(question.id, option.id)}
                            disabled={question.options.length <= 1}
                            size="small"
                          />
                        </div>
                      ))}

                      {(!question.options || question.options.length === 0) && (
                        <div className="text-gray-500">No hay opciones. Agrega al menos una opción.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Configuración para preguntas numéricas */}
                {question.type === "number" && (
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Valor Mínimo">
                      <Input
                        type="number"
                        value={question.min || ""}
                        onChange={(e) => handleQuestionChange(question.id, "min", e.target.value)}
                      />
                    </Form.Item>
                    <Form.Item label="Valor Máximo">
                      <Input
                        type="number"
                        value={question.max || ""}
                        onChange={(e) => handleQuestionChange(question.id, "max", e.target.value)}
                      />
                    </Form.Item>
                  </div>
                )}
              </Form>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveSurvey}>
          Guardar Encuesta
        </Button>
      </div>
    </div>
  )
}
