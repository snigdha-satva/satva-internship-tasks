import { useEffect } from "react";
import { login, logout, restoreUser } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from "react-redux";

function useAuth() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth)

    useEffect(() => {
        const stored = localStorage.getItem('auth')
        if (stored) {
            dispatch(restoreUser(JSON.parse(stored)))
        }
    }, [dispatch])

    // useEffect(() => {
    //     const handleStorage = (event) => {
    //         if (event.key === 'auth' && !event.newValue) {
    //             dispatch(logout())
    //         }
    //     }
    //     window.addEventListener('storage', handleStorage)
    //     return () => window.removeEventListener('storage', handleStorage)
    // }, [dispatch])

    const loginAction = (userData) => {
    dispatch(login(userData))
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isAuthenticated: true,
        user: userData,
      })
    )
  }

  const logoutAction = () => {
    dispatch(logout())
    localStorage.removeItem("auth")
  }

  const hasRole = (roles) => {
    return roles.includes(user?.role)
  }

  return { isAuthenticated, user, loginAction, logoutAction, hasRole }
}

export default useAuth;