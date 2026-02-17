import '../../style/App.css'
import Navbar from './Navbar.jsx'
import MainContent from './MainContent.jsx'
import Footer from './Footer.jsx'
import Sidebar from './Sidebar.jsx'

function LegoApp() {
  return (
    <div className="PageLayout">
      <Navbar title="Lego Layout" />

      <main className="MainWrapper">
        <Sidebar />
        <MainContent />
      </main>

      <Footer />
    </div>
  )
}

export default LegoApp