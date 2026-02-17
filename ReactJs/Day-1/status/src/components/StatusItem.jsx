import '../style/App.css'

function StatusItem({data}) {
    return (
    <div className="ObjectData">
        <div className="ObjectName">ID: {data.id}</div>
        <div className="ObjectName">Name: {data.name}</div>
        <div className="ObjectStatus">
            <div className="StatusText">Status: </div>
            <div className="Status" style={
                {color: (data.status.trim().toLowerCase() == "online") ? 'green': 'orange'}
                }>
                    {data.status}
            </div>
        </div>
    </div>
    )
}

export default StatusItem;