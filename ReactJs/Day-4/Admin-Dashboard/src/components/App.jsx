import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardLayout from './DashboardLayout'
import Dashboard from './Dashboard'
import Users from './Users'
import Settings from './Settings'
import { ConfigProvider, theme } from "antd";
import { useSelector } from "react-redux";
const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  }
])




function AppWrapper() {
  const mode = useSelector((state) => state.theme.mode);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App