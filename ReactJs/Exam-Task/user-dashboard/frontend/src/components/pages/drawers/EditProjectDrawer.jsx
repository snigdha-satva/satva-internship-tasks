import { useEffect } from "react";
import { Drawer, Form, Input, Select, DatePicker, Button, Space, message } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { editProject, fetchProjects } from "../../../redux/slices/projectSlice";

const EditProjectDrawer = ({ open, onClose, project }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { page, limit, search } = useSelector((state) => state.projects);

  useEffect(() => {
    if (project) {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        status: project.status,
        dateRange: [dayjs(project.startDate), dayjs(project.endDate)],
      });
    }
  }, [project, form]);

  const onFinish = async (values) => {
    if (!project) return;
    try {
      const { dateRange, ...rest } = values;
      await dispatch(
        editProject({
          id: project.id,
          data: {
            ...rest,
            startDate: dateRange[0].format("YYYY-MM-DD"),
            endDate: dateRange[1].format("YYYY-MM-DD"),
          },
        })
      ).unwrap();
      await dispatch(fetchProjects({ page, limit, search }));
      message.success("Project updated");
      onClose();
    } catch {
      message.error("Failed to update project");
    }
  };

  return (
    <Drawer
      title="Edit Project"
      open={open}
      onClose={onClose}
      width={440}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Save</Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item name="name" label="Project Name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
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

export default EditProjectDrawer;