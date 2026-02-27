import { Card, Typography, Tag, Row, Col } from "antd";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import PermissionMatrix from "./PermissionMatrix";

const { Title, Text } = Typography;

const ROLE_COLORS = { 1: "purple", 2: "blue", 3: "orange", 4: "green" };

const RolesPage = () => {
  const { roles } = useSelector((state) => state.roles);
  const { user, isAdmin } = useAuth();

  const currentRole = roles.find((r) => r.id === user?.roleId);
  const visibleRoles = isAdmin ? roles : roles.filter((r) => r.id === user?.roleId);

  return (
    <div>
      <Card className="rounded-xl !mb-2">
        <div className="!p-0">
          <Row align="middle" gutter={16}>
            <Col>
              <Text type="secondary" className="text-xs">
                Your Role
              </Text>
              <div className="mt-1">
                <Tag
                  color={ROLE_COLORS[user?.roleId] ?? "default"}
                  className="text-sm px-3 py-1"
                >
                  {currentRole?.role ?? "—"}
                </Tag>
              </div>
            </Col>
            <Col flex="auto">
              <Title level={5} className="m-0">
                {isAdmin
                  ? "Manage Role Permissions — click checkboxes to grant or revoke access"
                  : `Permissions assigned to ${currentRole?.role ?? "your role"}`}
              </Title>
              {isAdmin && (
                <Text type="secondary" className="text-xs">
                  Admin row is always locked. Changes apply immediately.
                </Text>
              )}
            </Col>
          </Row>
        </div>
      </Card>

      <Card className="rounded-xl">
        <div className="p-4">
          <PermissionMatrix visibleRoles={visibleRoles} />
        </div>
      </Card>
    </div>
  );
};

export default RolesPage;