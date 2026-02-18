import { useState, useEffect } from 'react'
import './App.css'
import './index.css'

function App() {
  const [count, setCount] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const toggleActive = () => {
    setIsActive(isActive => !isActive)
  }

  const resetCount = () => {
    setCount(0)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setCount(count => count + 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive])

  return (
    <>
      <div className="smartCounter">
        <h1>Current Count: {count}</h1>
        <div className="buttons">
          <button onClick={toggleActive}>{isActive ? "Pause" : "Start"}</button>
          <button onClick={resetCount}>Reset Counter</button>
        </div>
      </div>
    </>
  )
}

export default App
