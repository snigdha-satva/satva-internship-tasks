import { Layout, Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const { Sider } = Layout;

const AppSider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = useAuth();

  const permissionedItems = [
    { key: "/users", icon: <UserOutlined />, label: "Users", module: "users" },
    { key: "/employees", icon: <TeamOutlined />, label: "Employees", module: "employees" },
    { key: "/projects", icon: <ProjectOutlined />, label: "Projects", module: "projects" },
  ].filter((item) => hasPermission(item.module, "view") === true);

  const menuItems = [
    ...permissionedItems,
    { key: "/roles", icon: <SafetyOutlined />, label: "Roles" },
  ];

  return (
    <Sider
      width={220}
      style={{
        background: "#1a1a2e",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
      collapsible
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #2a2a4e",
        }}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
          RBAC
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ background: "#1a1a2e", borderRight: 0 }}
      />
    </Sider>
  );
};

export default AppSider;