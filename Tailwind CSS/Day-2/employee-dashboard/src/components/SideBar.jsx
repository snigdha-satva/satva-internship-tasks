import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'D' },
  { to: '/employees', label: 'Employees', icon: 'E' },
  { to: '/settings', label: 'Settings', icon: 'S' }
]

export default function Sidebar({ collapsed, overlayMode, onClose }) {
  const hidden = overlayMode ? collapsed : false
  const width = overlayMode ? 'w-64' : collapsed ? 'w-16' : 'w-64'

  return (
    <>
      {overlayMode && !collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
        />
      )}
      <aside
        className={`sidebar ${width} ${
          overlayMode
            ? hidden
              ? '-translate-x-full'
              : 'translate-x-0 animate-slide-in'
            : ''
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            ED
          </div>
          {(!collapsed || overlayMode) && (
            <span className="font-extrabold text-slate-800 dark:text-white text-base whitespace-nowrap tracking-tight">
              Employee Dashboard
            </span>
          )}
          {overlayMode && (
            <button onClick={onClose} className="btn-icon ml-auto text-lg">
              X
            </button>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {!collapsed && !overlayMode && (
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">
              Menu
            </p>
          )}
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={overlayMode ? onClose : undefined}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''} ${
                  collapsed && !overlayMode ? 'justify-center px-0' : ''
                }`
              }
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {(!collapsed || overlayMode) && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 pb-4 border-t border-slate-100 dark:border-slate-700 pt-3 flex-shrink-0">
          <div
            className={`flex items-center gap-3 px-1 ${
              collapsed && !overlayMode ? 'justify-center' : ''
            }`}
          >
            <div className="avatar w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 text-xs">
              AD
            </div>
            {(!collapsed || overlayMode) && (
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  Admin User
                </p>
                <p className="text-xs text-slate-400 truncate">admin@company.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

