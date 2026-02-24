import { Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import Home from './Home.jsx';
import NavigationBar from './NavigationBar.jsx';
import About from './About.jsx';
import User from './User.jsx';
import NotFound from './NotFound.jsx';

function LayoutWithNavbar() {
  return (
    <>
      <nav>
        <NavigationBar />
      </nav>
      <section>
        <Outlet />
      </section>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<LayoutWithNavbar />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="users/:id" element={<User />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
