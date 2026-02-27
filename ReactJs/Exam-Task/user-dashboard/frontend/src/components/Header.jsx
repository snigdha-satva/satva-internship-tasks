import { Layout, Typography, Button } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import {LogoutOutlined} from "@ant-design/icons"

const { Header } = Layout
const { Title } = Typography

const PAGE_TITLES = {
  "/users": "Users",
  "/employees": "Employees",
  "/projects": "Projects",
  "/roles": "Roles & Permissions",
};

function AppHeader() {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const title = PAGE_TITLES[location.pathname]

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login', {replace: true})
    }

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                padding: "0 24px",
                borderBottom: "1px solid #f0f0f0",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}
        >
            <Title level={3}>{title}</Title>
            <Button type="default" icon={<LogoutOutlined />} danger onClick={handleLogout}>Logout</Button>
        </Header>
    )
}

export default AppHeader