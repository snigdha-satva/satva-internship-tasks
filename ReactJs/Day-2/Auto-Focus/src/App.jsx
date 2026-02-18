import { useRef, useEffect } from 'react'
import './App.css'

function App() {
  const textFocus = useRef()
  const saveCount = useRef(0)

  useEffect(() => {
    textFocus.current.focus()
  });

  const incrementCount = () => {
    saveCount.current += 1
    console.log(saveCount.current)
  }

  return (
    <>
      <div className="textFocus">
        <div className="textArea">
        <textarea name="text" cols={50} rows={5} ref = {textFocus}></textarea>
        </div>
        <div className="manualSave">
        <button onClick={incrementCount}>Manual Save</button>
        </div>
      </div>
    </>
  )
}

export default App
