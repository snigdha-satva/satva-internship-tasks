import { createRoot } from 'react-dom/client'
import '../../style/index.css'
import LegoApp from './LegoApp.jsx'

createRoot(document.getElementById('LegoRoot')).render(
    <LegoApp />
)
