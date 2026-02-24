import '../styles/App.css'
import { Typography, message, Tag, Button, Table, Space, Popconfirm } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { deleteUser } from '../redux/slices/userSlice'
import 'antd/dist/reset.css'

const { Title } = Typography

function App() {
  const users = useSelector((state) => state.users.users)
  const dispatch = useDispatch()

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
    message.success("User deleted Successfully")
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: 80
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md']
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'Editor', value: 'Editor' },
        { text: 'Viewer', value: 'Viewer' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        let color = role === 'Admin' ? 'red' :
          role === 'Editor' ? 'green' : 'yellow';
        return <Tag color={color}>{role}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title='Are you sure?'
            description='This action cannot be undone.'
            onConfirm = {() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <>
      <div className="tableData">
        <Title level={2}>User Directory</Title>
        <Table
          columns={columns}
          dataSource={users}
          rowKey='id'
          bordered
          pagination={{ pageSize: 5}}
        >
        </Table>
      </div>
    </>
  )
}

export default App
