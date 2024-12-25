import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'smart-webcomponents-react/source/styles/smart.default.css';
import './assets/css/reset.scss'
// 覆盖smart-ui的样式
import './styles/smart-ui-theme.scss'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
