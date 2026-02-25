import { createRoot } from 'react-dom/client'
import './App.css'
import App from './components/App'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import "antd/dist/reset.css"

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
