import { Link } from 'react-router-dom';
import './App.css'

function NavigationBar() {
    return (
    <div className="navBar">
        <div className="pageName">
            RRouting
        </div>
        <div className="navItems">
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
        </div>
    </div>)
}

export default NavigationBar;