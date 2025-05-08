"use client"

import { useState } from "react"
import { Button, Layout, Typography, Space, UserOutlined, FormOutlined } from "@/components/ui"
import SurveyList from "@/components/survey-list"
import SurveyEditor from "@/components/survey-editor"
import SurveyForm from "@/components/survey-form"
import SurveyResults from "@/components/survey-results"
import { useLocalStorage } from "@/hooks/use-local-storage"

const { Header, Content } = Layout
const { Title } = Typography

export default function Home() {
  // Estados para manejar la aplicación
  const [surveys, setSurveys] = useLocalStorage("surveys", [])
  const [responses, setResponses] = useLocalStorage("responses", [])
  const [currentView, setCurrentView] = useState("list") // list, editor, form, results
  const [currentSurvey, setCurrentSurvey] = useState(null)
  const [currentResponse, setCurrentResponse] = useState({
    id: "",
    surveyId: "",
    answers: {},
    submittedAt: null,
  })
  const [userRole, setUserRole] = useState("admin") // admin o user

  // Función para crear una nueva encuesta
  const handleCreateSurvey = () => {
    setCurrentSurvey({
      id: Date.now().toString(),
      title: "Nueva Encuesta",
      description: "Descripción de la encuesta",
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setCurrentView("editor")
  }

  // Función para editar una encuesta existente
  const handleEditSurvey = (survey) => {
    setCurrentSurvey(survey)
    setCurrentView("editor")
  }

  // Función para responder una encuesta
  const handleAnswerSurvey = (survey) => {
    setCurrentSurvey(survey)
    setCurrentResponse({
      id: Date.now().toString(),
      surveyId: survey.id,
      answers: {},
      submittedAt: null,
    })
    setCurrentView("form")
  }

  // Función para ver resultados de una encuesta
  const handleViewResults = (survey) => {
    setCurrentSurvey(survey)
    setCurrentView("results")
  }

  // Función para guardar una encuesta
  const handleSaveSurvey = (updatedSurvey) => {
    const updatedSurveys = surveys.some((s) => s.id === updatedSurvey.id)
      ? surveys.map((s) => (s.id === updatedSurvey.id ? updatedSurvey : s))
      : [...surveys, updatedSurvey]

    setSurveys(updatedSurveys)
    setCurrentView("list")
  }

  // Función para guardar una respuesta
  const handleSaveResponse = (response) => {
    const updatedResponse = {
      ...response,
      submittedAt: new Date().toISOString(),
    }
    setResponses([...responses, updatedResponse])
    setCurrentView("list")
  }

  // Función para eliminar una encuesta
  const handleDeleteSurvey = (surveyId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta encuesta?")) {
      setSurveys(surveys.filter((s) => s.id !== surveyId))
      // También eliminar las respuestas asociadas
      setResponses(responses.filter((r) => r.surveyId !== surveyId))
    }
  }

  // Función para cambiar el rol del usuario (para demostración)
  const toggleUserRole = () => {
    setUserRole(userRole === "admin" ? "user" : "admin")
  }

  // Renderizar el contenido según la vista actual
  const renderContent = () => {
    switch (currentView) {
      case "editor":
        return currentSurvey && <SurveyEditor survey={currentSurvey} onSave={handleSaveSurvey} />
      case "form":
        return (
          currentSurvey &&
          currentResponse && (
            <SurveyForm survey={currentSurvey} response={currentResponse} onSubmit={handleSaveResponse} />
          )
        )
      case "results":
        return (
          currentSurvey && (
            <SurveyResults
              survey={currentSurvey}
              responses={responses.filter((r) => r.surveyId === currentSurvey.id)}
            />
          )
        )
      case "list":
      default:
        return (
          <SurveyList
            surveys={surveys}
            userRole={userRole}
            onEdit={handleEditSurvey}
            onAnswer={handleAnswerSurvey}
            onViewResults={handleViewResults}
            onDelete={handleDeleteSurvey}
            responses={responses}
          />
        )
    }
  }

  return (
    <Layout className="min-h-screen">
      <Header className="site-header">
        <div className="site-container flex justify-between items-center">
          <Title level={3} onClick={() => setCurrentView("list")} style={{ margin: 0, cursor: "pointer" }}>
            Encuestas Dinámicas
          </Title>
          <Space>
            <Button onClick={toggleUserRole} icon={<UserOutlined />}>
              Rol: {userRole === "admin" ? "Administrador" : "Usuario"}
            </Button>
            {userRole === "admin" && currentView === "list" && (
              <Button type="primary" onClick={handleCreateSurvey} icon={<FormOutlined />}>
                Nueva Encuesta
              </Button>
            )}
            {currentView !== "list" && <Button onClick={() => setCurrentView("list")}>Volver a la Lista</Button>}
          </Space>
        </div>
      </Header>
      <Content className="site-main">
        <div className="site-container">{renderContent()}</div>
      </Content>
    </Layout>
  )
}
