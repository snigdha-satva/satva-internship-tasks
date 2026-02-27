import { Checkbox, Table, Tag, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { grantRolePermission, revokeRolePermission } from "../../redux/slices/roleSlice";
import useAuth from "../../hooks/useAuth";

const PERMISSION_MAP = {
  users: { view: 2, add: 1, edit: 3, delete: 4 },
  employees: { view: 6, add: 5, edit: 7, delete: 8 },
  projects: { view: 10, add: 9, edit: 11, delete: 12 },
};

const MODULES = ["users", "employees", "projects"];
const ACTIONS = ["view", "add", "edit", "delete"];

const MODULE_LABELS = { users: "Users", employees: "Employees", projects: "Projects" };
const ACTION_COLORS = { view: "blue", add: "green", edit: "orange", delete: "red" };
const ROLE_COLORS = { 1: "purple", 2: "blue", 3: "orange", 4: "green" };

const PermissionMatrix = ({ visibleRoles }) => {
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();

  const isChecked = (role, module, action) => {
    const permissionId = PERMISSION_MAP[module]?.[action];
    return role.allowed.includes(permissionId);
  };

  const handleChange = (checked, roleId, module, action) => {
    const permissionId = PERMISSION_MAP[module]?.[action];
    const viewPermissionId = PERMISSION_MAP[module]?.view;

    if (checked) {
      const idsToGrant = [permissionId];
      if ((action === "edit" || action === "delete") && viewPermissionId) {
        idsToGrant.push(viewPermissionId);
      }
      dispatch(grantRolePermission({ roleId, permissionIds: idsToGrant }));
    } else {
      const idsToRevoke = [permissionId];
      if (action === "view") {
        const editId = PERMISSION_MAP[module]?.edit;
        const deleteId = PERMISSION_MAP[module]?.delete;
        if (editId) idsToRevoke.push(editId);
        if (deleteId) idsToRevoke.push(deleteId);
      }
      dispatch(revokeRolePermission({ roleId, permissionIds: idsToRevoke }));
    }
  };

  const columns = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 130,
      fixed: "left",
      render: (role, record) => (
        <Tag color={ROLE_COLORS[record.id] ?? "default"}>{role}</Tag>
      ),
    },
    ...MODULES.flatMap((module) =>
      ACTIONS.map((action) => ({
        title: (
          <div className= "text-center">
            <div className= "text-[11] text-[#666]">{MODULE_LABELS[module]}</div>
            <Tag color={ACTION_COLORS[action]} className="!text-[4] m-0">
              {action}
            </Tag>
          </div>
        ),
        key: `${module}-${action}`,
        width: 90,
        align: "center",
        render: (_, record) => {
          const isAdminRole = record.id === 1;
          const disabled = isAdminRole || !isAdmin;
          return (
            <Tooltip title={isAdminRole ? "Admin permissions cannot be modified" : undefined}>
              <Checkbox
                checked={isChecked(record, module, action)}
                disabled={disabled}
                onChange={(e) => handleChange(e.target.checked, record.id, module, action)}
              />
            </Tooltip>
          );
        },
      }))
    ),
  ];

  return (
    <Table
      dataSource={visibleRoles}
      columns={columns}
      rowKey="id"
      pagination={false}
      scroll={{ x: "max-content" }}
      bordered
      size="middle"
      className="rounded-12 overflow-hidden"
    />
  );
};

export default PermissionMatrix;