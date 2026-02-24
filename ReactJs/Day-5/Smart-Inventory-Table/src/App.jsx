import './App.css'
import { Typography, message, Tag, Button, Table, Space, Popconfirm } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { deleteProduct } from './redux/slices/productSlice'
import 'antd/dist/reset.css'

const { Title } = Typography

function App() {
  const Products = useSelector((state) => state.products.products)
  const dispatch = useDispatch()

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    message.success("Product deleted Successfully")
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price.localeCompare(b.price)
    },
    
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
            
            <Button danger onClick={() => {handleDelete(record.id)}}>Delete</Button>
        </Space>
      )
    }
  ]

  return (
    <>
      <div className="tableData">
        <Title level={2}>Product Directory</Title>
        <Table
          columns={columns}
          dataSource={Products}
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
