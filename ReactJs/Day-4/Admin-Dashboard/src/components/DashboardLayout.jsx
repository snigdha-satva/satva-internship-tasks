import { Layout, Menu, Space, Switch } from 'antd'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    UserOutlined,
    SettingOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../redux/slices/layoutSlice'
import { toggleTheme } from '../redux/slices/themeSlice'

const { Header, Sider, Content } = Layout;

function DashboardLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const collapsed = useSelector((state) => state.layout.collapsed);
    const themeMode = useSelector((state) => state.theme.mode);

    return (
        <Layout style={{ minHeight: '100vh'}}>
            <Sider 
                collapsible
                collapsed={collapsed}
                theme={themeMode}
                trigger={null}
            >
                <Menu
                    theme={themeMode}
                    mode='inline'
                    selectedKeys={[location.pathname]}
                    onClick={(e) => navigate(e.key)}
                    items={[
                        {
                            key: '/',
                            icon: <DashboardOutlined />,
                            label: 'Dashboard',
                        },
                        {
                            key: "/users",
                            icon: <UserOutlined />,
                            label: "Users",
                            },
                            {
                            key: "/settings",
                            icon: <SettingOutlined />,
                            label: "Settings",
                        }
                    ]}
                >

                </Menu>
                <Space>
                <Switch
                    style={{marginLeft: 10}}
                    checked={themeMode === "dark"}
                    onChange={() => dispatch(toggleTheme())}
                    checkedChildren="Dark"
                    unCheckedChildren="Light"
                    />
                </Space>
            </Sider>

            <Layout>
                <Header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 16px",
                    background: "#172641af",
                    width: '1286px'
                }}
                >
                <div onClick={() => dispatch(toggleSidebar())}>
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
                
                </Header>

                <Content style={{ margin: "16px" }}>
                <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default DashboardLayout;