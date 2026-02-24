import { useDispatch, useSelector } from 'react-redux'
import '../styles/App.css'
import { Button, InputNumber, Typography, Space, message, Card  } from 'antd'
import { decrement, increment, setValue } from '../Redux/slice/counterSlice';
import { useEffect } from 'react';

const { Title } = Typography

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (count !== 0 && count % 10 == 0) {
      message.success(`Count is ${count}, a multiple of 10`)
    }
  }, [count])

  return (
    <>
      <div className="counterDisplay">
        <div className="countDisplay">
          <Title>Redux Counter: {count}</Title>
        </div>
        <Space size = "middle">
        <Button type='primary' onClick={() => dispatch(increment())}>Increment</Button>
        <Button type='primary' onClick={() => dispatch(decrement())}>Decrement</Button>
        </Space>
        <div className="inputValue">
          <InputNumber placeholder='Enter a value' onChange={(value) => {
            if (typeof value === 'number') {
              dispatch(setValue(value))
            }
            else {
              dispatch(setValue(0))
            }
          }}></InputNumber>
        </div>
      </div>
    </>
  )
}

export default App
