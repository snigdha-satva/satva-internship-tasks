import StatusItem from './StatusItem'

function Dashboard({ObjectData}) {
    return (
    ObjectData.map(object => (
        <StatusItem key={object.id} data={object}/>
    ))
    )
}

export default Dashboard;