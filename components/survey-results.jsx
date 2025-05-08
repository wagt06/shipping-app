"use client"

import { Card, Typography, List, Progress, Divider, Empty } from "antd"

const { Title, Text, Paragraph } = Typography

export default function SurveyResults({ survey, responses }) {
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

          {(question.type === "single" || question.type === "multiple") && question.options && (
            <List
              itemLayout="horizontal"
              dataSource={question.options}
              renderItem={(option) => {
                // Count responses for this option
                const count = responses.filter((r) => {
                  const answer = r.answers[question.id]
                  if (question.type === "single") {
                    return answer === option.id
                  } else if (question.type === "multiple") {
                    return Array.isArray(answer) && answer.includes(option.id)
                  }
                  return false
                }).length

                const percent = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0

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
          )}

          {question.type !== "single" && question.type !== "multiple" && (
            <Text>
              {responses.filter((r) => r.answers[question.id]).length} respuestas de tipo{" "}
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
