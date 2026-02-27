import { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, Popconfirm, Tag, message, Card, Row, Col, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, removeUser, setUsersPage, setUsersSearch } from "../../redux/slices/userSlice";
import useAuth from "../../hooks/useAuth";
import SearchBar from "../../components/Search";
import AddUserDrawer from "./drawers/AddUserDrawer";
import EditUserDrawer from "./drawers/EditUserDrawer";

const { Title } = Typography;

const ROLE_COLORS = { 1: "purple", 2: "blue", 3: "orange", 4: "green" };

const UsersPage = () => {
  const dispatch = useDispatch();
  const { users, total, loading, page, limit, searchTerm } = useSelector((state) => state.users);
  const roles = useSelector((state) => state.roles.roles);
  const { hasPermission, user: currentUser, isAdmin } = useAuth();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = useCallback((val) => {
    dispatch(setUsersSearch(val));
  }, [dispatch]);

  const canAdd = hasPermission("users", "add");
  const canEdit = hasPermission("users", "edit");
  const canDelete = hasPermission("users", "delete");

  useEffect(() => {
    dispatch(fetchUsers({ page, limit, search: searchTerm }));
  }, [page, searchTerm]);

  const getRoleName = (roleId) => roles.find((r) => r.id === roleId)?.role ?? roleId;

  const handleDelete = async (id) => {
    try {
      await dispatch(removeUser(id)).unwrap();
      dispatch(fetchUsers({ page, limit, search: searchTerm }));
      message.success("User deleted");
    } catch {
      message.error("Failed to delete user");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", render: (t) => <strong>{t}</strong> },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "roleId",
      render: (roleId) => (
        <Tag color={ROLE_COLORS[roleId] ?? "default"}>{getRoleName(roleId)}</Tag>
      ),
    },
    ...(canEdit || canDelete
      ? [
        {
          title: "Actions",
          key: "actions",
          width: 120,
          render: (_, record) => {
            const isSelf = record.id === currentUser?.id;
            const isTargetAdmin = record.roleId === 1;
            const isRestrictedTarget = isSelf || (!isAdmin && isTargetAdmin);
            return (
              <Space>
                {canEdit && (
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    disabled={isRestrictedTarget}
                    onClick={() => { setSelectedUser(record); setEditOpen(true); }}
                  />
                )}
                {canDelete && (
                  <Popconfirm
                    title="Delete this user?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                    disabled={isRestrictedTarget}
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" disabled={isRestrictedTarget} />
                  </Popconfirm>
                )}
              </Space>
            );
          },
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
              <Title level={5} className="m-0">{total} total users</Title>
            </Col>
            <Col>
              <Space>
                <SearchBar
                  placeholder="Search users..."
                  onSearch={handleSearch}
                />
                {canAdd && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setAddOpen(true)}
                    className="!bg-[linear-gradient(135deg,#667eea,#764ba2)] !border-none"
                  >
                    Add User
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>
      </Card>

      <Card className="rounded-xl">
        <div className="!p-0">
          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total,
              showSizeChanger: false,
              showTotal: (t) => `${t} users`,
              onChange: (p) => dispatch(setUsersPage(p)),
            }}
            className="rounded-xl overflow-hidden"
          />
        </div>
      </Card>

      <AddUserDrawer
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => dispatch(fetchUsers({ page: 1, limit, search: searchTerm }))}
      />
      <EditUserDrawer
        open={editOpen}
        onClose={() => { setEditOpen(false); setSelectedUser(null); }}
        user={selectedUser}
        onSuccess={() => dispatch(fetchUsers({ page, limit, search: searchTerm }))}
      />
    </div>
  );
};

export default UsersPage;
