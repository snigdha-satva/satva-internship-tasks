import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, module, action }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const { initialized } = useSelector((state) => state.roles);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (module && action) {
    if (!initialized) return <Spin fullscreen />;
    if (!hasPermission(module, action)) return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;