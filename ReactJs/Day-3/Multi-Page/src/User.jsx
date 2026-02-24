import './App.css'
import { useParams } from "react-router-dom"
function User() {
    const {id} = useParams()

    return (
        <div className="User">
            This is User {id}
        </div>
    )
}

export default User