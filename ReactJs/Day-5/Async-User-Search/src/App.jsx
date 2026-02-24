import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchData } from "./redux/slices/userSlice"

import {
  Layout,
  Typography,
  List,
  Card,
  Spin,
  Alert,
  Space,
  Skeleton
} from "antd"

const { Title } = Typography
const { Content } = Layout

function App() {
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector(
    (state) => state.users
  )

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  return (
    <Layout style={{ minHeight: "100vh", padding: 40 }}>
      <Content style={{ width: 1271, margin: "0 auto" }}>
        
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          User Directory
        </Title>

        {error && (
          <Alert
            title="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {loading && (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        )}

        {!loading && !error && (
          <List
            grid={{
              gutter: 24,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
            }}
            dataSource={data}
            locale={{ emptyText: "No users found" }}
            renderItem={(user) => (
              <List.Item key={user.id}>
                <Card title={user.name} hoverable>
                  <Space direction="vertical">
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Username:</strong> {user.username}</div>
                    <div><strong>Company:</strong> {user.company?.name}</div>
                  </Space>
                </Card>
              </List.Item>
            )}
          />
        )}

      </Content>
    </Layout>
  )
}

export default App