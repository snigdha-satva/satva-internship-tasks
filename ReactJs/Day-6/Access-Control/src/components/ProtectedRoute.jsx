import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ roles, children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }


  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute