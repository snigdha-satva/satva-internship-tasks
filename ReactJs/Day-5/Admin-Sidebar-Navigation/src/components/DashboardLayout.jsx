import { Layout, Menu } from "antd"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import { Outlet, Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toggleSidebar } from "../redux/slices/layoutSlice"

const { Header, Sider, Content } = Layout

function DashboardLayout() {
  const dispatch = useDispatch()
  const location = useLocation()

  const collapsed = useSelector((state) => state.layout.collapsed)
  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme="dark"
        width={220}
        style={{
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: 1,
          }}
        >
          {collapsed ? "AD" : "Admin Panel"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            background: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div
            onClick={() => dispatch(toggleSidebar())}
            style={{
              fontSize: 18,
              cursor: "pointer",
              marginRight: 24,
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>

        </Header>

        {/* CONTENT */}
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#ffffff",
            borderRadius: 12,
            minHeight: 360,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout