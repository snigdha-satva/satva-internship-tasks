import { useTheme } from '../components/ThemeProvider'

function Navbar({ sidebarWidth, onMenuClick }) {
    const { darkMode, toggleDarkMode } = useTheme()

    return (
        <>
            <header
                className="navbar"
                style={{ left: sidebarWidth }}
            >
                <button
                    onClick={onMenuClick}
                    className="btn-icon text-xl"
                    title="Toggle menu"
                >
                    Toggle
                </button>
                <div className="flex items-center gap-1 ml-auto">
                    <button
                        onClick={toggleDarkMode}
                        className="btn-icon text-xl"
                        title="Toggle dark mode"
                    >
                        {darkMode ? 'Light' : 'Dark'}
                    </button>
                    <div className="avatar w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 text-xs ml-1 cursor-pointer">
                        AD
                    </div>
                </div>
            </header>
        </>
    )
}

export default Navbar;