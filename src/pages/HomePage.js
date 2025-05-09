import { useState } from "react"
import { Button, Layout, Typography, Space,Image, Menu } from "antd"
import { UserOutlined, FormOutlined, MoonOutlined,SunOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import SurveyList from "../components/SurveyList"
import SurveyEditor from "../components/SurveyEditor"
import SurveyForm from "../components/SurveyForm"
import SurveyResults from "../components/SurveyResults"
import { useLocalStorage } from "../hooks/useLocalStorage"
import MenuPrincipal from "../components/menus/MenuPrincipal"

const { Header, Content } = Layout
const { Title } = Typography

function HomePage({ setThemeMode, themeMode,user }) {
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



debugger;


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
  //   setUserRole(userRole === "admin" ? "user" : "admin")
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
            userRole={user.role}
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
    <Layout className={`vh-100 ${themeMode}`}>
      <MenuPrincipal setThemeMode = {setThemeMode} user={user} themeMode={themeMode} currentView={currentView} setCurrentView={setCurrentView} handleCreateSurvey ={handleCreateSurvey}/>
      <Content className="container mx-auto">
         {currentView !== "list" && 
         <Button className="mt-1 mb-1" onClick={() => setCurrentView("list")}>
          <ArrowLeftOutlined/>
          </Button>
          }
        <div className="site-container">{renderContent()}</div>
      </Content>
    </Layout>
  )
}

export default HomePage
