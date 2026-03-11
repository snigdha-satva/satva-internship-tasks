import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { employees } from '../data/employeeData'

const revenueData = [
  { month: 'Jan', revenue: 420000 },
  { month: 'Feb', revenue: 380000 },
  { month: 'Mar', revenue: 510000 },
  { month: 'Apr', revenue: 490000 },
  { month: 'May', revenue: 560000 },
  { month: 'Jun', revenue: 620000 },
  { month: 'Jul', revenue: 590000 },
  { month: 'Aug', revenue: 680000 },
  { month: 'Sep', revenue: 720000 },
  { month: 'Oct', revenue: 750000 },
  { month: 'Nov', revenue: 810000 },
  { month: 'Dec', revenue: 890000 },
]

const activity = [
  { id: 1, user: 'Alice Johnson', action: 'Updated profile', time: '2m ago', type: 'update' },
  { id: 2, user: 'Bob Smith', action: 'Approved leave request', time: '15m ago', type: 'approval' },
  { id: 3, user: 'Carol Davis', action: 'Added new employee', time: '1h ago', type: 'add' },
  { id: 4, user: 'David Wilson', action: 'Submitted leave request', time: '2h ago', type: 'request' },
  { id: 5, user: 'Eve Brown', action: 'Updated salary record', time: '3h ago', type: 'update' },
]

const kpis = [
  { label: 'Total Employees', value: '248', change: '+12', changeColor: 'text-emerald-500' },
  { label: 'Active', value: '231', change: '+8', changeColor: 'text-emerald-500' },
  { label: 'On Leave', value: '11', change: '-2', changeColor: 'text-red-500' },
  { label: 'New Joiners', value: '14', change: '+5', changeColor: 'text-emerald-500' },
]

const typeBadge = type => {
  const m = { update: 'badge-blue', approval: 'badge-yellow', add: 'badge-green', request: 'badge-gray' }
  return m[type] || 'badge-gray'
}

export default function Dashboard() {
  const deptCounts = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back — here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} flex items-center justify-center text-xl`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
                {kpi.label}
              </p>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1">
                {kpi.value}
              </p>
              <p className={`text-xs font-semibold mt-1 ${kpi.changeColor}`}>
                {kpi.change} this month
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-5">
            Revenue Overview
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                  width={52}
                />
                <Tooltip
                  formatter={v => [`$${v.toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    borderRadius: '10px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-5">
            By Department
          </h2>
          <div className="space-y-4">
            {Object.entries(deptCounts).map(([dept, count]) => (
              <div key={dept}>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  <span>{dept}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-700"
                    style={{ width: `${(count / employees.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-bold text-slate-800 dark:text-white mb-5">
          Recent Activity
        </h2>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr>
                <th className="table-header">User</th>
                <th className="table-header">Action</th>
                <th className="table-header">Type</th>
                <th className="table-header">Time</th>
              </tr>
            </thead>
            <tbody>
              {activity.map(item => (
                <tr key={item.id} className="table-row">
                  <td className="table-cell font-semibold">{item.user}</td>
                  <td className="table-cell">{item.action}</td>
                  <td className="table-cell">
                    <span className={typeBadge(item.type)}>{item.type}</span>
                  </td>
                  <td className="table-cell text-slate-400">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}