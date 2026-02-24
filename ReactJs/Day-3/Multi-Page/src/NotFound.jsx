import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
    const [count, setCount] = useState(5)
    const navigate = useNavigate()

    useEffect(() => {
        if (count === 0) {
            navigate('/');
            return;
        }

        const timer = setInterval(() => {
            setCount(count => count - 1)
        }, 1000);

        return () => clearInterval(timer);
    }, [count, navigate])

    return (
        <div className="timer">
            You will be redirected to Home in {count} seconds
        </div>
    )
}

export default NotFound;