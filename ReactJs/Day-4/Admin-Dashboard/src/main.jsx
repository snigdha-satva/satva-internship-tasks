import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './components/App.jsx'
import { store } from './redux/store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
