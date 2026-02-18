import { useCallback, useEffect, useState } from 'react';
import './App.css'
import ListItem from './ListItem.jsx'

function Dashboard() {
    const [items, setItem] = useState([
        {id: 1, name: "Snigdha"},
        {id: 2, name: "Tanya"},
        {id: 3, name: "Khushi"},
        {id: 4, name: "Ansh"}
    ])

    const [currentTime, setCurrentTime] = useState(new Date())  // Store Date object, not string

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())  // Store Date object
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    const deleteItem = useCallback((id) => {
        setItem((prev) => prev.filter(item => item.id !== id))
    }, [])

    console.log("Dashboard Rendered")

    return (
        <div className="AllItem">
            <div className="CurrentTime">
                Current Time: {currentTime.toLocaleTimeString()}
            </div>
            <div className="ChildList">
                {items.map((item) =>
                    <ListItem key={item.id} data={item} onDelete={deleteItem} />
                )}
            </div>
        </div>
    )
}

export default Dashboard;