import { Drawer, Form, Input, Select, DatePicker, Button, Space, message } from "antd";
import { useDispatch } from "react-redux";
import { createProject } from "../../../redux/slices/projectSlice";

const AddProjectDrawer = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      const { dateRange, ...rest } = values;
      await dispatch(
        createProject({
          ...rest,
          startDate: dateRange[0].format("YYYY-MM-DD"),
          endDate: dateRange[1].format("YYYY-MM-DD"),
        })
      ).unwrap();
      message.success("Project created");
      form.resetFields();
      
    } catch {
      message.error("Failed to create project");
    }
  };

  return (
    <Drawer
      title="Add Project"
      open={open}
      onClose={() => { form.resetFields(); onClose(); }}
      width={440}
      extra={
        <Space>
          <Button onClick={() => { form.resetFields(); onClose(); }}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Create</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="name" label="Project Name" rules={[{ required: true }]}>
          <Input placeholder="My Project" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} placeholder="Brief description..." />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="completed">Completed</Select.Option>
            <Select.Option value="on-hold">On Hold</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="dateRange" label="Date Range" rules={[{ required: true }]}>
          <DatePicker.RangePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddProjectDrawer;