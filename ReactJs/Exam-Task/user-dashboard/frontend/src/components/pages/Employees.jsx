import { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, Popconfirm, message, Card, Row, Col, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees, removeEmployee, setEmployeesPage, setEmployeesSearch } from "../../redux/slices/employeeSlice";
import useAuth from "../../hooks/useAuth";
import SearchBar from "../../components/Search";
import AddEmployeeDrawer from "./drawers/AddEmployeeDrawer";
import EditEmployeeDrawer from "./drawers/EditEmployeeDrawer";

const { Title } = Typography;

function Employees () {
    const dispatch = useDispatch();
    const { employees, total, loading, page, limit, searchTerm } = useSelector((state) => state.employees);
    const { hasPermission } = useAuth();

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleSearch = useCallback((val) => {
        dispatch(setEmployeesSearch(val));
    }, [dispatch]);

    const canAdd = hasPermission("employees", "add");
    const canEdit = hasPermission("employees", "edit");
    const canDelete = hasPermission("employees", "delete");

    useEffect(() => {
        dispatch(fetchEmployees({ page, limit, searchTerm }));
    }, [page, searchTerm]);

    const handleDelete = async (id) => {
        try {
            await dispatch(removeEmployee(id)).unwrap();
            dispatch(fetchEmployees({ page, limit, searchTerm }));
            message.success("Employee deleted");
        } catch {
            message.error("Failed to delete employee");
        }
    };

    const columns = [
        { title: "Name", dataIndex: "name", key: "name", render: (t) => <strong>{t}</strong> },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Department", dataIndex: "department", key: "department" },
        { title: "Position", dataIndex: "position", key: "position" },
        { title: "Phone", dataIndex: "phone", key: "phone" },
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
                                    title="Delete this employee?"
                                    onConfirm={() => handleDelete(record.id)}
                                    okText="Yes"
                                    cancelText="No"
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
            <Card style={{ borderRadius: 12, marginBottom: 16 }} styles={{ body: { padding: "20px 24px" } }}>
                <Row align="middle" justify="space-between">
                    <Col>
                        <Title level={5} style={{ margin: 0 }}>{total} total employees</Title>
                    </Col>
                    <Col>
                        <Space>
                            <SearchBar
                                placeholder="Search employees..."
                                onSearch={handleSearch}
                            />
                            {canAdd && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setAddOpen(true)}
                                    style={{
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        border: "none",
                                    }}
                                >
                                    Add Employee
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 0 } }}>
                <Table
                    dataSource={employees}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total,
                        showSizeChanger: false,
                        showTotal: (t) => `${t} employees`,
                        onChange: (p) => dispatch(setEmployeesPage(p)),
                    }}
                    style={{ borderRadius: 12, overflow: "hidden" }}
                />
            </Card>

            <AddEmployeeDrawer open={addOpen} onClose={() => setAddOpen(false)} />
            <EditEmployeeDrawer
                open={editOpen}
                onClose={() => { setEditOpen(false); setSelected(null); }}
                employee={selected}
            />
        </div>
    );
};

export default Employees;
