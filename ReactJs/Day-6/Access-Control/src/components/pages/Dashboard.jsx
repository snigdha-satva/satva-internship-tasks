import { Card, Typography } from "antd"

const { Title, Text } = Typography

function Dashboard() {
  return (
    <Card className="page-card">
      <Title level={3}>Dashboard</Title>
      This is common Dashboard
    </Card>
  )
}

export default Dashboard