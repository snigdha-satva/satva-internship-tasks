import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";
import { lazy } from "react";
import Layout from "../components/Layout";
import { Suspense } from "react";

const Dashboard = lazy(() => import('../components/pages/Dashboard'))
const Employees = lazy(() => import('../components/pages/Employees'))
const Settings = lazy(() => import('../components/pages/Settings'))

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Layout>
                <Suspense fallback={<SkeletonLoader />}>
                    <Outlet />
                </Suspense>
            </Layout>
        ),
        children: [
            { 
                index: true, 
                element: <Dashboard />
            },
            {
                path: '/employees',
                element: <Employees />
            },
            {
                path: '/settings',
                element: <Settings />
            }
        ]
    }
])


export default router;