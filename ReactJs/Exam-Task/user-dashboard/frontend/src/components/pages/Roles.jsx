// import { useEffect } from "react";
import { Card, Typography, Tag, Row, Col } from "antd";
import {  useSelector } from "react-redux";
// import { fetchRoles, fetchPermissions } from "../../redux/slices/roleSlice";
import useAuth from "../../hooks/useAuth";
import PermissionMatrix from "./PermissionMatrix";

const { Title, Text } = Typography;

const ROLE_COLORS = { 1: "purple", 2: "blue", 3: "orange", 4: "green" };

const RolesPage = () => {
  // const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  const { user, isAdmin } = useAuth();

  // useEffect(() => {
  //   dispatch(fetchRoles());
  //   dispatch(fetchPermissions());
  // }, []);

  const currentRole = roles.find((r) => r.id === user?.roleId);
  const visibleRoles = isAdmin ? roles : roles.filter((r) => r.id === user?.roleId);

  return (
    <div>
      <Card
        style={{ borderRadius: 12, marginBottom: 20 }}
        styles={{ body: { padding: "20px 24px" } }}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <Text type="secondary" style={{ fontSize: 12 }}>Your Role</Text>
            <div style={{ marginTop: 4 }}>
              <Tag
                color={ROLE_COLORS[user?.roleId] ?? "default"}
                style={{ fontSize: 14, padding: "4px 12px" }}
              >
                {currentRole?.role ?? "—"}
              </Tag>
            </div>
          </Col>
          <Col flex="auto">
            <Title level={5} style={{ margin: 0 }}>
              {isAdmin
                ? "Manage Role Permissions — click checkboxes to grant or revoke access"
                : `Permissions assigned to ${currentRole?.role ?? "your role"}`}
            </Title>
            {isAdmin && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Admin row is always locked. Changes apply immediately.
              </Text>
            )}
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 12 }} styles={{ body: { padding: 16 } }}>
        <PermissionMatrix visibleRoles={visibleRoles} />
      </Card>
    </div>
  );
};

export default RolesPage;