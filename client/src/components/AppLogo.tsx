import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function AppLogo() {
    const navigate = useNavigate()
    const { user } = useUser()

    const handleClick = () => {
        if (user) {
            navigate('/dashboard')
        } else {
            navigate('/')
        }
    }

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'fixed',
                top: 16,
                left: 20,
                zIndex: 999,
                fontSize: 22,
                fontWeight: 700,
                color: '#1976d2',
                cursor: 'pointer',
                userSelect: 'none',
                fontFamily: 'monospace',
            }}
        >
            Fa
        </div>
    )
}
