import '../../style/App.css'
import UserCard from './UserCard.jsx'
function App() {
  return (
    <>
      <UserCard name='Snigdha' role='Software Developer Intern' isAvailable={true} />
      <UserCard name='Tanya' role='Project Manager' isAvailable={true} />
      <UserCard name='Khushi' role='Designer Intern' isAvailable={false} />
    </>
  )
}

export default App
