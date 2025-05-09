import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import UserMenu from './components/UserMenu'
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import SettingsPage from './pages/SettingsPage'
import AppLogo from './components/AppLogo'
import TwoFactorSetup from './pages/TwoFactorSetup'
import TwoFactorLogin from './pages/TwoFactorLogin'
import OAuthSuccessHandler from './pages/OAuthSuccessHandler'
function App() {
    return (
        <Router>
            <UserMenu />
            <AppLogo />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <SettingsPage />
                        </PrivateRoute>
                    }
                />
                <Route path="/2fa" element={<TwoFactorLogin />} />
                <Route path="/2fa-setup" element={<TwoFactorSetup />} />
                {/* <Route path="/oauth/callback" element={<OAuthCallbackPage />} /> */}
                <Route
                    path="/oauth-success"
                    element={<OAuthSuccessHandler />}
                />
            </Routes>
        </Router>
    )
}

export default App
