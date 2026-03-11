import { NavLink } from "react-router-dom";

const navItems = [
    { to: '/', label: 'Dashboard', icon: 'D' },
    { to: '/employees', label: 'Employees', icon: 'E' },
    { to: '/settings', label: 'Settings', icon: 'S' }
]

function BottomNav() {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex md:hidden z-20 safe-area-pb">
            {navItems.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `bottom-nav-item ${isActive ? 'bottom-nav-active' : ''}`
                    }
                >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    )
}

export default BottomNav;

