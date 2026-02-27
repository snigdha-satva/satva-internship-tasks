import { Drawer, Form, Input, Select, Button, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../../redux/slices/userSlice";

const AddUserDrawer = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.roles);

  const onFinish = async (values) => {
    try {
      await dispatch(createUser({ userData: values })).unwrap();
      message.success("User created successfully");
      form.resetFields();
      onSuccess();
      onClose();
    } catch {
      message.error("Failed to create user");
    }
  };

  return (
    <Drawer
      title="Add New User"
      open={open}
      onClose={() => { form.resetFields(); onClose(); }}
      width={420}
      extra={
        <Space>
          <Button onClick={() => { form.resetFields(); onClose(); }}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Create</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Name is required" }]}>
          <Input placeholder="John Doe" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}
        >
          <Input placeholder="john@example.com" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password is required" }, { min: 6, message: "Minimum 6 characters" }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>
        <Form.Item name="roleId" label="Role" rules={[{ required: true, message: "Role is required" }]}>
          <Select placeholder="Select a role">
            {roles.map((r) => (
              <Select.Option key={r.id} value={r.id}>{r.role}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddUserDrawer;