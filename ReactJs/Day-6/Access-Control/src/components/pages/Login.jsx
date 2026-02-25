import { Card, Form, Input, Button, Typography } from "antd"
import { useNavigate } from "react-router-dom"
import { USERS } from "../userData"
import useAuth from "../hooks/useAuth"

const { Title } = Typography

function Login() {
    const navigate = useNavigate()
    const { loginAction } = useAuth()

    const onFinish = (values) => {
        const matched = USERS.find(
            u => u.username === values.username && u.password === values.password
        )

        if (matched) {
            loginAction({ username: matched.username, role: matched.role })
            return navigate("/dashboard")
        }
    }

    return (
        <div className="login-container">
            <Card className="login-card">
                <Title level={3}>Login</Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form>
            </Card>
        </div>
    )
}

export default Login;