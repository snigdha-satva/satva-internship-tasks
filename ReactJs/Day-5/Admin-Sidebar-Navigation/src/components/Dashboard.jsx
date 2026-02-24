import { Row, Col, Card, Statistic } from "antd";
import { UserOutlined } from "@ant-design/icons";

function Dashboard() {
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={1200}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Active Sessions" value={324} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Revenue" value={89234} prefix="₹" />
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Dashboard;