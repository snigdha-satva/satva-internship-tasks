import React, { memo } from 'react'
import Toggle from '../Toggle'
import { useTheme } from '../ThemeProvider'

const Row = memo(({ label, desc, checked, onChange }) => (
  <div className="settings-row">
    <div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </p>
      {desc && (
        <p className="text-xs text-slate-400 mt-0.5">
          {desc}
        </p>
      )}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
))

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your preferences and account</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="avatar w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-xl flex-shrink-0">
            AD
          </div>
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Admin User</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">admin@company.com</p>
            <div className="flex gap-2 mt-2 justify-center sm:justify-start flex-wrap">
              <span className="badge-blue">Administrator</span>
              <span className="badge-green">Active</span>
            </div>
          </div>
          <button className="btn-secondary text-xs flex-shrink-0">Edit Profile</button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="text-base font-bold text-slate-800 dark:text-white mb-1">Appearance</h2>
        <p className="text-xs text-slate-400 mb-4">Customize the look and feel</p>
        <Row label="Dark Mode" desc="Switch between light and dark theme" checked={darkMode} onChange={toggleDarkMode} />
      </div>

      <div className="settings-section">
        <h2 className="text-base font-bold text-slate-800 dark:text-white mb-4">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Delete Account</p>
            <p className="text-xs text-red-500 dark:text-red-400/70 mt-0.5">This will permanently remove all your data</p>
          </div>
          <button className="btn-danger text-xs whitespace-nowrap">Delete Account</button>
        </div>
      </div>
    </div>
  )
}