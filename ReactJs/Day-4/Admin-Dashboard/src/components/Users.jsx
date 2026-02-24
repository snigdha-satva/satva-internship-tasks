import { Table } from "antd";

function Users() {
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Role", dataIndex: "role" },
  ];

  const data = [
    { key: 1, name: "John Doe", email: "john@mail.com", role: "Admin" },
    { key: 2, name: "Jane Smith", email: "jane@mail.com", role: "User" },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
}

export default Users;