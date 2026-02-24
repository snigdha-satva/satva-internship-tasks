import { useReducer, useState } from 'react'
import './App.css'

const initialCount = {
  count: 0,
  history: []
}


function App() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "INCREASE":
        return {
          count: state.count + 1,
          history: [...state.history, state.count]
        }
      case "DECREASE":
        return {
          count: state.count - 1,
          history: [...state.history, state.count]
        }
      case "RESET":
        return {
          count: 0,
          history: [...state.history, state.count]
        }
      case "SET_VALUE":
        return {
          count: action.payload, 
          history: [...state.history, state.count]
        }
      default:
        return {
          count: state.count,
          history: [...state.history, state.count]
        }
    }
  }

  const [state, dispatch] = useReducer(reducer, initialCount)
  const [input, setInput] = useState(state.count)

  return (
    <div className="reducerCounter">
      <div className="count">
        Count: {state.count}
      </div>
      <div className="inputValue">
        <input type="number" name="inputvalue" id="inputValue" onChange={(e) => setInput(e.target.value)} />
      </div>
      <div className="actionButtons">
        <button onClick={() => {dispatch({type: "INCREASE"})}}>INCREASE</button>
        <button onClick={() => {dispatch({type: "DECREASE"})}}>DECREASE</button>
        <button onClick={() => {dispatch({type: "RESET"})}}>RESET</button>
        <button onClick={() => {dispatch({type: "SET_VALUE", payload: Number(input)})}}>SET VALUE</button>
      </div>
      <div className="history">
        History: {state.history}
      </div>
    </div>
      
  )
}

export default App
