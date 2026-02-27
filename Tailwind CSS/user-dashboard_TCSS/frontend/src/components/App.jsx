import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { fetchRoles, fetchPermissions } from "../redux/slices/roleSlice";
import { logout } from "../redux/slices/authSlice";
import router from "../routes/router";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchRoles());
      dispatch(fetchPermissions());
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(fetchRoles());
    dispatch(fetchPermissions());

    const permissionPoll = setInterval(() => {
      dispatch(fetchRoles());
    }, 30000);

    const tokenCheck = setInterval(() => {
      if (!localStorage.getItem("authToken")) {
        dispatch(logout());
      }
    }, 1000);

    const handleStorageChange = (e) => {
      if (e.key === "authToken" && !e.newValue) {
        dispatch(logout());
      }
    };

    const handleFocus = () => {
      dispatch(fetchRoles());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(permissionPoll);
      clearInterval(tokenCheck);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated]);

  return <RouterProvider router={router} />;
}

export default App;