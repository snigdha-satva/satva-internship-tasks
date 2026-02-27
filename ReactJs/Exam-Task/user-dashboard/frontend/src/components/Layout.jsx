import { Layout } from "antd";
import { Outlet } from 'react-router-dom'
import AppSider from './Sider'
import AppHeader from './Header'

const { Content } = Layout

function AppLayout() {
    return (
        <Layout style={{minHeight:"100vh"}}>
            <AppSider />
            <Layout>
                <AppHeader />
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default AppLayout
