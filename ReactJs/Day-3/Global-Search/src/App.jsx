import { Routes, Route } from "react-router-dom";
import GlobalSearch from "./SearchDirectory";
import UserDetail from "./UserDetail";

function App() {
  return (
      <Routes>
        <Route path="/" element={<GlobalSearch />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
  );
}

export default App;