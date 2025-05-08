import { Card, Typography, List, Progress, Divider, Empty } from "antd"

const { Title, Text, Paragraph } = Typography

function SurveyResults({ survey, responses }) {
  // Calcular estadísticas de las respuestas
  const calculateStatistics = () => {
    const questionStats = {}

    survey.questions.forEach((question) => {
      questionStats[question.id] = {
        type: question.type,
        totalResponses: 0,
        options: {},
      }

      if (question.type === "single" || question.type === "multiple") {
        question.options.forEach((option) => {
          questionStats[question.id].options[option.id] = 0
        })
      }
    })

    responses.forEach((response) => {
      Object.keys(response.answers).forEach((questionId) => {
        if (questionStats[questionId]) {
          questionStats[questionId].totalResponses++

          if (questionStats[questionId].type === "single") {
            const selectedOption = response.answers[questionId]
            if (selectedOption && questionStats[questionId].options[selectedOption] !== undefined) {
              questionStats[questionId].options[selectedOption]++
            }
          } else if (questionStats[questionId].type === "multiple") {
            const selectedOptions = response.answers[questionId] || []
            selectedOptions.forEach((optionId) => {
              if (questionStats[questionId].options[optionId] !== undefined) {
                questionStats[questionId].options[optionId]++
              }
            })
          }
        }
      })
    })

    return questionStats
  }

  const questionStats = calculateStatistics()

  if (responses.length === 0) {
    return (
      <Card title="Resultados de la Encuesta">
        <Empty description="No hay respuestas para esta encuesta todavía" />
      </Card>
    )
  }

  return (
    <Card title={`Resultados: ${survey.title}`}>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        {survey.description}
      </Paragraph>

      <Text strong>Total de respuestas: {responses.length}</Text>

      <Divider />

      {survey.questions.map((question, index) => (
        <div key={question.id} className="mb-8">
          <Title level={5}>
            {index + 1}. {question.title}
          </Title>

          {question.type === "single" || question.type === "multiple" ? (
            <List
              itemLayout="horizontal"
              dataSource={question.options}
              renderItem={(option) => {
                const count = questionStats[question.id].options[option.id] || 0
                const percent =
                  questionStats[question.id].totalResponses > 0
                    ? Math.round((count / questionStats[question.id].totalResponses) * 100)
                    : 0

                return (
                  <List.Item>
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Text>{option.text}</Text>
                        <Text>
                          {count} respuestas ({percent}%)
                        </Text>
                      </div>
                      <Progress percent={percent} showInfo={false} />
                    </div>
                  </List.Item>
                )
              }}
            />
          ) : (
            <Text>
              {questionStats[question.id].totalResponses} respuestas de tipo{" "}
              {question.type === "text"
                ? "texto"
                : question.type === "number"
                  ? "numérico"
                  : question.type === "date"
                    ? "fecha"
                    : question.type}
            </Text>
          )}
        </div>
      ))}
    </Card>
  )
}

export default SurveyResults
