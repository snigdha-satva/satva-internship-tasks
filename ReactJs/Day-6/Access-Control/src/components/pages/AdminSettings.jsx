import { Card, Typography, Table, Button, Space } from "antd"

const { Title } = Typography

function AdminSettings() {

    const usersData = [
        { key: 1, username: "john", role: "User" },
        { key: 2, username: "admin", role: "Admin" }
    ]

    const columns = [
        {
            title: "Username",
            dataIndex: "username",
            key: "username"
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role"
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <Space>
                    <Button type="link">Edit</Button>
                    <Button type="link" danger>Delete</Button>
                </Space>
            )
        }
    ]

    return (
        <Card>
            <Title level={2}>Admin Settings</Title>

            <Table
                columns={columns}
                dataSource={usersData}
                pagination={false}
            />
        </Card>
    )
}

export default AdminSettings