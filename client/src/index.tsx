import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { UserProvider } from './context/UserContext'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { CurrencyProvider } from './context/CurrencyContext'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <UserProvider>
                <CurrencyProvider>
                    <App />
                    <ToastContainer position="top-right" autoClose={3000} />
                </CurrencyProvider>
            </UserProvider>
        </ThemeProvider>
    </React.StrictMode>
)
