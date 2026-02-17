import '../../style/App.css'

function Navbar({title}) {
    return (
    <div className="NavbarStyle">
        <div className="WebsiteLogo">{title}</div>
        <div className='NavOptions'>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Lego</a></li>
            <li><a href="#">Status</a></li>
        </div>
    </div>
    )
}

export default Navbar;