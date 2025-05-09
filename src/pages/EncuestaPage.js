import React from "react"
import { useParams } from "react-router-dom"
import SurveyForm from "../components/SurveyForm"

const EncuestaPage = () => {
  const { id } = useParams()

  return (
    <div>
      <SurveyForm encuestaId={id} />
    </div>
  )
}

export default EncuestaPage
