import { Drawer, Form, Input, Button, Space, message } from "antd";
import { useDispatch } from "react-redux";
import { createEmployee } from "../../../redux/slices/employeeSlice";

const AddEmployeeDrawer = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      await dispatch(createEmployee(values)).unwrap();
      message.success("Employee added successfully");
      form.resetFields();
    } catch {
      message.error("Failed to add employee");
    }
  };

  return (
    <Drawer
      title="Add Employee"
      open={open}
      onClose={() => { form.resetFields(); onClose(); }}
      width={420}
      extra={
        <Space>
          <Button onClick={() => { form.resetFields(); onClose(); }}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Add</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <Input placeholder="Jane Smith" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}>
          <Input placeholder="jane@company.com" />
        </Form.Item>
        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
          <Input placeholder="Engineering" />
        </Form.Item>
        <Form.Item name="position" label="Position" rules={[{ required: true }]}>
          <Input placeholder="Software Engineer" />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input placeholder="+1 555 000 0000" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddEmployeeDrawer;