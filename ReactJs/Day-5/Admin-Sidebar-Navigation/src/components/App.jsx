import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardLayout from './DashboardLayout'
import Dashboard from './Dashboard'
import Users from './Users'
import Settings from './Settings'

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

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App