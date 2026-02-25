import { Layout, Menu, Dropdown, Typography } from "antd"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import useAuth from "./hooks/useAuth"
import '../App.css'
// import { useEffect } from "react"

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

function AppLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useSelector(state => state.auth)
    const { logoutAction } = useAuth()

    const menuItems = [
        { key: "/dashboard", label: "Dashboard" },
        user?.role === "User" && { key: "/userSettings", label: "User Settings" },
        user?.role === "Admin" && { key: "/adminSettings", label: "Admin Settings" }
    ].filter(Boolean)

    const dropdownItems = [
        {
        key: "logout",
        label: "Logout",
        onClick: () => {
            logoutAction()
        }
        }
    ]
    
    // useEffect(() => {
    //     if (isAuthenticated) {
    //        return navigate("/dashboard")
    //     }
    //     else {
    //         return navigate('/')
    //     }
    // }, [isAuthenticated, navigate])

    return (
        <Layout className="app-layout">
            <Sider className="app-sider">
                <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
                />
            </Sider>
            <Layout>
            <Header className="app-header">
                <Dropdown menu={{ items: dropdownItems }}>
                    <Text className="user-info">
                    {user?.username} ({user?.role})
                    </Text>
                </Dropdown>
            </Header>
            <Content className="app-content">
                <Outlet />
            </Content>
            </ Layout>
        </Layout>
    )
}

export default AppLayout;