import './App.css'
import { Link } from 'react-router-dom';
function Home() {
    const users = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" }
    ]

    return (
        <div className="homePage">
            {users.map(user => (
            <div key={user.id}>
            <Link to={`/users/${user.id}`}>
                {user.name}
            </Link>
        </div>
      ))}
        </div>
    )
}

export default Home;