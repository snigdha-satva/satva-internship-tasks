import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from '../components/pages/Unauthorized'
import Login from "../components/pages/Login";
import Users from "../components/pages/Users";
import Projects from "../components/pages/Projects";
import Employees from "../components/pages/Employees";
import AppLayout from "../components/Layout";
import Roles from "../components/pages/Roles";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/roles" replace /> },
            {
                path: "users",
                element: (
                    <ProtectedRoute module="users" action="view">
                        <Users />
                    </ProtectedRoute>
                ),
            },
            {
                path: "employees",
                element: (
                    <ProtectedRoute module="employees" action="view">
                        <Employees />
                    </ProtectedRoute>
                ),
            },
            {
                path: "projects",
                element: (
                    <ProtectedRoute module="projects" action="view">
                        <Projects />
                    </ProtectedRoute>
                ),
            },
            {
                path: "roles",
                element: (
                    <ProtectedRoute>
                        <Roles />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: "*", element: <Navigate to="/" replace /> },
]);

export default router