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
      className="bg-[#1a1a2e] min-h-screen sticky top-0 left-0"
      collapsible
    >
      <div className="h-16 px-6 flex items-center justify-center border-b border-[#2a2a6e]">
        <span className="text-white font-bold text-lg tracking-normal">
          RBAC
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className= "bg-[#1a1a2e] border-r-0 "
      />
    </Sider>
  );
};

export default AppSider;