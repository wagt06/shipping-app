"use client"

import { useState } from "react"
import { Card, Input, Button, Typography, Select, Checkbox, Space, Form, Alert, Tooltip,Empty } from "antd"
import {
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SaveOutlined,
  MenuOutlined,
} from "@ant-design/icons"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

// Tipos de preguntas disponibles
const QUESTION_TYPES = [
  { id: "text", name: "Texto", icon: "📝" },
  { id: "single", name: "Selección Única", icon: "🔘" },
  { id: "multiple", name: "Selección Múltiple", icon: "☑️" },
  { id: "number", name: "Numérico", icon: "🔢" },
  { id: "date", name: "Fecha", icon: "📅" },
]

function SurveyEditor({ survey, onSave }) {
  const [currentSurvey, setCurrentSurvey] = useState(survey)
  const [errors, setErrors] = useState({})
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

  // Duplicar una pregunta
  const handleDuplicateQuestion = (questionId) => {
    const questionToDuplicate = currentSurvey.questions.find((q) => q.id === questionId)
    if (!questionToDuplicate) return

    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: Date.now().toString(),
      title: `${questionToDuplicate.title} (copia)`,
    }

    const questionIndex = currentSurvey.questions.findIndex((q) => q.id === questionId)
    const updatedQuestions = [...currentSurvey.questions]
    updatedQuestions.splice(questionIndex + 1, 0, duplicatedQuestion)

    setCurrentSurvey({
      ...currentSurvey,
      questions: updatedQuestions,
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

  // Mover una pregunta hacia arriba
  const handleMoveQuestionUp = (questionId) => {
    const questionIndex = currentSurvey.questions.findIndex((q) => q.id === questionId)
    if (questionIndex <= 0) return

    const updatedQuestions = [...currentSurvey.questions]
    const temp = updatedQuestions[questionIndex]
    updatedQuestions[questionIndex] = updatedQuestions[questionIndex - 1]
    updatedQuestions[questionIndex - 1] = temp

    setCurrentSurvey({
      ...currentSurvey,
      questions: updatedQuestions,
      updatedAt: new Date().toISOString(),
    })
  }

  // Mover una pregunta hacia abajo
  const handleMoveQuestionDown = (questionId) => {
    const questionIndex = currentSurvey.questions.findIndex((q) => q.id === questionId)
    if (questionIndex >= currentSurvey.questions.length - 1) return

    const updatedQuestions = [...currentSurvey.questions]
    const temp = updatedQuestions[questionIndex]
    updatedQuestions[questionIndex] = updatedQuestions[questionIndex + 1]
    updatedQuestions[questionIndex + 1] = temp

    setCurrentSurvey({
      ...currentSurvey,
      questions: updatedQuestions,
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
              options: [...q.options, { id: Date.now().toString(), text: "Nueva opción" }],
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

  // Manejar el reordenamiento de preguntas con drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return

    const questions = Array.from(currentSurvey.questions)
    const [reorderedItem] = questions.splice(result.source.index, 1)
    questions.splice(result.destination.index, 0, reorderedItem)

    setCurrentSurvey({
      ...currentSurvey,
      questions: questions,
      updatedAt: new Date().toISOString(),
    })
  }

  // Validar la encuesta antes de guardar
  const validateSurvey = () => {
    const newErrors = {}

    if (!currentSurvey.title.trim()) {
      newErrors.title = "El título de la encuesta es obligatorio"
    }

    currentSurvey.questions.forEach((question, index) => {
      if (!question.title.trim()) {
        newErrors[`question_${index}`] = "El título de la pregunta es obligatorio"
      }

      if ((question.type === "single" || question.type === "multiple") && question.options.length < 2) {
        newErrors[`question_options_${index}`] = "Se requieren al menos 2 opciones"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Guardar la encuesta
  const handleSaveSurvey = () => {
    if (validateSurvey()) {
      onSave(currentSurvey)
    } else {
      // Desplazarse al primer error
      const firstErrorKey = Object.keys(errors)[0]
      if (firstErrorKey) {
        const element = document.getElementById(firstErrorKey)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    }
  }

  return (
    <div className="mt-2">
      <Card 
      
      title={
        <div className="d-flex justify-content-between align-items-center">
          <span >
               Editar Encuesta
          </span>
            <Button className type="primary" icon={<SaveOutlined />} onClick={handleSaveSurvey}>
            Guardar Encuesta
          </Button>
        </div>
      }

>
        <Form layout="vertical">
          <Form.Item
            label="Título de la Encuesta"
            validateStatus={errors.title ? "error" : ""}
            help={errors.title}
            required
          >
            <Input id="title" name="title" value={currentSurvey.title} onChange={handleSurveyChange} />
          </Form.Item>
          <Form.Item label="Descripción">
            <TextArea
              id="description"
              name="description"
              value={currentSurvey.description}
              onChange={handleSurveyChange}
              rows={3}
            />
          </Form.Item>
        </Form>
      </Card>

      <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
        <Title level={4}>Preguntas</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddQuestion}>
          Pregunta
        </Button>
      </div>

      {currentSurvey.questions.length === 0 ? (
        <>
          <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          styles={{ image: { height: 60 } }}
          description={
            <Typography.Text>
              No hay preguntas en esta encuesta. Haz clic empezar.
            </Typography.Text>
          }
        >
          <Button type="primary">Agregar Preguntas</Button>
        </Empty>
        </>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd} >
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="mb-4 pb-5">
                {currentSurvey.questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={errors[`question_${index}`] ? "question-card error" : "question-card" + " mb-2"}
                        id={`question_${index}`}
                        title={
                          <div className="flex items-center">
                            <span {...provided.dragHandleProps} className="drag-handle me-3">
                              <MenuOutlined />
                            </span>
                            <span>Pregunta {index + 1}</span>
                          </div>
                        }
                        extra={
                          <Space>
                            <Tooltip title="Mover arriba">
                              <Button
                                icon={<ArrowUpOutlined />}
                                onClick={() => handleMoveQuestionUp(question.id)}
                                disabled={index === 0}
                                size="small"
                              />
                            </Tooltip>
                            <Tooltip title="Mover abajo">
                              <Button
                                icon={<ArrowDownOutlined />}
                                onClick={() => handleMoveQuestionDown(question.id)}
                                disabled={index === currentSurvey.questions.length - 1}
                                size="small"
                              />
                            </Tooltip>
                            <Tooltip title="Duplicar">
                              <Button
                                icon={<CopyOutlined />}
                                onClick={() => handleDuplicateQuestion(question.id)}
                                size="small"
                              />
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <Button
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteQuestion(question.id)}
                                size="small"
                                danger
                              />
                            </Tooltip>
                          </Space>
                        }
                      >
                        <Form layout="vertical">
                          <Form.Item
                            label="Título de la Pregunta"
                            validateStatus={errors[`question_${index}`] ? "error" : ""}
                            help={errors[`question_${index}`]}
                            required
                          >
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
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <Text strong>Opciones</Text>
                                <Button
                                  type="dashed"
                                  size="small"
                                  icon={<PlusOutlined />}
                                  onClick={() => handleAddOption(question.id)}
                                >
                                  Agregar Opción
                                </Button>
                              </div>

                              {errors[`question_options_${index}`] && (
                                <Alert
                                  message={errors[`question_options_${index}`]}
                                  type="error"
                                  showIcon
                                  style={{ marginBottom: 16 }}
                                />
                              )}

                              <div className="row g-1">
                                {question.options.map((option) => (
                                  <div key={option.id} className="d-flex align-items-center mb-2">
                                    <Input
                                      value={option.text}
                                      onChange={(e) => handleOptionChange(question.id, option.id, e.target.value)}
                                      style={{ marginRight: 8 }}
                                    />
                                    <Button
                                      icon={<DeleteOutlined />}
                                      onClick={() => handleDeleteOption(question.id, option.id)}
                                      disabled={question.options.length <= 1}
                                      size="small"
                                    />
                                  </div>
                                ))}

                                {question.options.length === 0 && (
                                  <Text type="secondary">No hay opciones. Agrega al menos una opción.</Text>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Configuración para preguntas numéricas */}
                          {question.type === "number" && (
                            <div className="d-flex">
                              <Form.Item label="Valor Mínimo" >
                                <Input
                                  type="number"
                                  value={question.min || ""}
                                  onChange={(e) => handleQuestionChange(question.id, "min", e.target.value)}
                                />
                              </Form.Item>
                              <Form.Item label="Valor Máximo" className="ms-1">
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <div className="fixed-bottom m-3 mt-2 d-row align-content-center">
        <Button className="col-ms-12 col-md-6 col-lg-auto" type="primary" icon={<SaveOutlined />} onClick={handleSaveSurvey}>
          Guardar Encuesta
        </Button>
      </div>
    </div>
  )
}

export default SurveyEditor
