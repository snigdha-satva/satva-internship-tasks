import { Card, Typography, Form, Input, Button, message } from "antd"
import { useSelector } from "react-redux"

const { Title } = Typography

function UserSettings() {
    const { user } = useSelector(state => state.auth)

    const onFinish = (values) => {
        message.success("User settings updated successfully.")
        console.log("Updated User Data:", values)
    }

    return (
        <Card>
            <Title level={2}>User Settings</Title>

            <Form
                layout="vertical"
                initialValues={{
                    username: user?.username,
                    email: ""
                }}
                onFinish={onFinish}
                style={{ maxWidth: 400 }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Email is required" }]}
                >
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                    Save Changes
                </Button>
            </Form>
        </Card>
    )
}

export default UserSettings