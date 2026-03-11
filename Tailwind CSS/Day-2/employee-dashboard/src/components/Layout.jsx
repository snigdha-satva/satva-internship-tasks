import React, { useState, useEffect } from 'react'
import Sidebar from './SideBar'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth
      const mobile = width < 768
      const desktop = width >= 1024
      setIsMobile(mobile)
      setIsDesktop(desktop)
      if (desktop) setDrawerOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const overlayMode = !isDesktop
  const sidebarWidth = isDesktop ? (sidebarCollapsed ? 64 : 256) : 0

  const onMenuClick = () => {
    if (overlayMode) {
      setDrawerOpen(prev => !prev)
    } else {
      setSidebarCollapsed(prev => !prev)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar
        collapsed={overlayMode ? !drawerOpen : sidebarCollapsed}
        overlayMode={overlayMode}
        onClose={() => setDrawerOpen(false)}
      />
      <Navbar
        sidebarWidth={sidebarWidth}
        onMenuClick={onMenuClick}
      />
      <main
        className="main-content"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <div className="p-4 md:p-6 animate-fade-in">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
