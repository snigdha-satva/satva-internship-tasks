import { useSelector } from "react-redux";
import { Spin } from "antd";

const PERMISSION_MAP = {
  users: { view: 2, add: 1, edit: 3, delete: 4 },
  employees: { view: 6, add: 5, edit: 7, delete: 8 },
  projects: { view: 10, add: 9, edit: 11, delete: 12 },
};

const useAuth = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { roles, loading } = useSelector((state) => state.roles);

  const hasPermission = (module, action) => {
    if (!user) return false;
    if (loading) return false;

    const role = roles.find((r) => r.id === user.roleId);
    if (!role) return false;

    const permissionId = PERMISSION_MAP[module]?.[action];
    if (!permissionId) return false;
    
    return role.allowed.includes(permissionId);
  };

  const isAdmin = user?.roleId === 1;

  return {
    user,
    token,
    isAuthenticated,
    hasPermission,
    isAdmin,
    rolesLoading: loading,
  };
};

export default useAuth;