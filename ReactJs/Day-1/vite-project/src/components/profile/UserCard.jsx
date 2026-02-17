import '../../style/App.css'

function UserCard({name, role, isAvailable}) {
    return (
        <div className='CardView'>
            <div className='ProfileDetails'>Name: {name}</div>
            <div className='ProfileDetails'>Role: {role}</div>
            <div className='AvailabilityRow'>
                <div>Available: </div>
                <div
                    className='AvailabilityDot'
                    style={{
                        backgroundColor: isAvailable ? "green" : "red"
                    }}
                ></div>
            </div>
        </div>
    )
}

export default UserCard;