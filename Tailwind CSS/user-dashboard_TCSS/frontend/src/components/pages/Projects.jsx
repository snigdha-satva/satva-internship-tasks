import { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, Popconfirm, Tag, message, Card, Row, Col, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, removeProject, setProjectsPage, setProjectsSearch } from "../../redux/slices/projectSlice";
import useAuth from "../../hooks/useAuth";
import SearchBar from "../../components/Search";
import AddProjectDrawer from "./drawers/AddProjectDrawer";
import EditProjectDrawer from "./drawers/EditProjectDrawer";

const { Title } = Typography;

const STATUS_COLORS = { active: "green", completed: "blue", "on-hold": "orange" };

function Projects() {
  const dispatch = useDispatch();
  const { projects, total, loading, page, limit, searchTerm } = useSelector((state) => state.projects);
  const { hasPermission } = useAuth();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSearch = useCallback((val) => {
    dispatch(setProjectsSearch(val));
  }, [dispatch]);

  const canAdd = hasPermission("projects", "add");
  const canEdit = hasPermission("projects", "edit");
  const canDelete = hasPermission("projects", "delete");

  useEffect(() => {
    dispatch(fetchProjects({ page, limit, searchTerm }));
  }, [page, searchTerm]);

  const handleDelete = async (id) => {
    try {
      await dispatch(removeProject(id)).unwrap();
      message.success("Project deleted");
      dispatch(fetchProjects({ page, limit, searchTerm }));
    } catch {
      message.error("Failed to delete project");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", render: (t) => <strong>{t}</strong> },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) =>
        s ? (
          <Tag color={STATUS_COLORS[s] ?? "default"}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Tag>
        ) : (
          <Tag>—</Tag>
        ),
    },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    ...(canEdit || canDelete
      ? [
        {
          title: "Actions",
          key: "actions",
          width: 120,
          render: (_, record) => (
            <Space>
              {canEdit && (
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => { setSelected(record); setEditOpen(true); }}
                />
              )}
              {canDelete && (
                <Popconfirm
                  title="Delete this project?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
              )}
            </Space>
          ),
        },
      ]
      : []),
  ];

  return (
    <div>
      <Card className="rounded-xl !mb-2">
        <div className="p-1">
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={5} className="m-2">{total} total projects</Title>
            </Col>
            <Col>
              <Space>
                <SearchBar
                  placeholder="Search projects..."
                  onSearch={handleSearch}
                />
                {canAdd && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setAddOpen(true)}
                    className="!bg-[linear-gradient(135deg,#667eea,#764ba2)] !border-none"
                  >
                    Add Project
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>
      </Card>

      <Card className="rounded-xl">
        <div className="p-0">
          <Table
            dataSource={projects}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total,
              showSizeChanger: false,
              onChange: (p) => dispatch(setProjectsPage(p)),
            }}
          />
        </div>
      </Card>

      <AddProjectDrawer open={addOpen} onClose={() => setAddOpen(false)} />
      <EditProjectDrawer
        open={editOpen}
        onClose={() => { setEditOpen(false); setSelected(null); }}
        project={selected}
      />
    </div>
  );
}

export default Projects;
