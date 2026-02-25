import { createBrowserRouter } from "react-router-dom"
import Login from "./pages/Login"
import AppLayout from "./Layout"
import Dashboard from "./pages/Dashboard"
import UserSettings from "./pages/UserSettings"
import AdminSettings from "./pages/AdminSettings"
import Unauthorized from "./pages/Unauthorized"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PubicRoute"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
      <Login />
      </PublicRoute>
  )
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/userSettings",
            element: (
              <ProtectedRoute roles={["User"]}>
                <UserSettings />
              </ProtectedRoute>
            )
          },
          {
            path: "/adminSettings",
            element: (
              <ProtectedRoute roles={["Admin"]}>
                <AdminSettings />
              </ProtectedRoute>
            )
          }
        ]
      }
    ]
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />
  },
  {
    path: "*",
    element: <NotFound />
  }
])

export default router