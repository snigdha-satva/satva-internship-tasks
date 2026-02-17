import '../style/App.css'
import Dashboard from './Dashboard'

function App() {
    const Objects = [
          { id: 1, name: "Database", status: "Online" },
          { id: 2, name: "API Server", status: "Maintenance" },
          { id: 3, name: "UI/UX", status: "Online" }]

  return (
    <>
      <Dashboard ObjectData={Objects}/>
    </>
  )
}

export default App
