import router from "../routes/Routing"
import Routing from "../routes/Routing"
import { RouterProvider } from 'react-router-dom'

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
