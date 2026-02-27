import { useEffect } from "react";
import { Drawer, Form, Input, Button, Space, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editEmployee, fetchEmployees } from "../../../redux/slices/employeeSlice";

const EditEmployeeDrawer = ({ open, onClose, employee }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { page, limit, search } = useSelector((state) => state.employees);

  useEffect(() => {
    if (employee) form.setFieldsValue(employee);
  }, [employee, form]);

  const onFinish = async (values) => {
    if (!employee) return;
    try {
      await dispatch(editEmployee({ id: employee.id, data: values })).unwrap();
      await dispatch(fetchEmployees({ page, limit, search }));
      message.success("Employee updated");
      onClose();
    } catch {
      message.error("Failed to update employee");
    }
  };

  return (
    <Drawer
      title="Edit Employee"
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
        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}><Input /></Form.Item>
        <Form.Item name="department" label="Department" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="position" label="Position" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}><Input /></Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditEmployeeDrawer;