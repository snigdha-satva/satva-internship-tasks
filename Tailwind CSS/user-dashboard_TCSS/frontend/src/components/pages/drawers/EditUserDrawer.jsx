import { useEffect } from "react";
import { Drawer, Form, Input, Select, Button, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../../redux/slices/userSlice";

const EditUserDrawer = ({ open, onClose, user, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const roles = useSelector((state) => state.roles.roles);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        roleId: user.roleId,
        password: "••••••••",
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    if (!user) return;
    try {
      await dispatch(editUser({ id: user.id, name: values.name })).unwrap();
      message.success("User updated successfully");
      onSuccess();
      onClose();
    } catch {
      message.error("Failed to update user");
    }
  };

  return (
    <Drawer
      title="Edit User"
      open={open}
      onClose={onClose}
      width={420}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Save</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Name is required" }]}>
          <Input placeholder="John Doe" />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>
        <Form.Item name="roleId" label="Role">
          <Select disabled>
            {roles.map((r) => (
              <Select.Option key={r.id} value={r.id}>{r.role}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="password" label="Password">
          <Input.Password disabled />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditUserDrawer;