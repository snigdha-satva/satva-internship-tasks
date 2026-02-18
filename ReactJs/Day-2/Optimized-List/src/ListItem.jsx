import React from 'react'
import './App.css'
const ListItem = ({data, onDelete}) => {
    console.log("Child List Rendered")

    return (
        <div className="listItem">
            <div className="itemName">
                Name: {data.name}
            </div>
            <div className="deleteItem">
                <button onClick={() => onDelete(data.id)}>Delete</button>
            </div>
        </div>
    )
}

export default React.memo(ListItem);