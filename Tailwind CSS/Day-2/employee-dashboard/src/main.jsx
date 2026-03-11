import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App'
import { ThemeProvider } from './components/ThemeProvider'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
