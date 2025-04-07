import { useState, useRef, useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi'
import { useTheme } from '@mui/material'

export default function UserMenu() {
    const { user, setUser } = useUser()
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    const UserIcon = FiUser as unknown as React.FC<{
        size?: number
        style?: React.CSSProperties
    }>
    const SettingsIcon = FiSettings as unknown as React.FC<{
        size?: number
        style?: React.CSSProperties
    }>
    const LogoutIcon = FiLogOut as unknown as React.FC<{
        size?: number
        style?: React.CSSProperties
    }>

    const handleLogout = () => {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/')
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!user) return null

    return (
        <div
            style={{
                position: 'fixed',
                top: 16,
                right: 20,
                zIndex: 999,
            }}
            ref={menuRef}
        >
            <div
                onClick={() => setOpen((prev) => !prev)}
                style={{
                    cursor: 'pointer',
                    borderRadius: '50%',
                    background: isDark ? '#333' : '#eee',
                    padding: '0.5rem',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: isDark ? '#fff' : '#000',
                }}
            >
                <UserIcon size={20} />
            </div>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '110%',
                        right: 0,
                        background: isDark ? '#1e1e1e' : '#fff',
                        color: isDark ? '#f0f0f0' : '#000',
                        border: '1px solid',
                        borderColor: isDark ? '#444' : '#ccc',
                        borderRadius: 4,
                        padding: '0.5rem',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        minWidth: 160,
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            marginBottom: 8,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <UserIcon style={{ marginRight: 8 }} />
                        {user.name}
                    </div>
                    <div
                        onClick={() => {
                            setOpen(false)
                            navigate('/settings')
                        }}
                        style={{
                            cursor: 'pointer',
                            marginBottom: 8,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <SettingsIcon style={{ marginRight: 8 }} />
                        Settings
                    </div>
                    <div
                        onClick={handleLogout}
                        style={{
                            cursor: 'pointer',
                            color: 'red',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <LogoutIcon style={{ marginRight: 8 }} />
                        Logout
                    </div>
                </div>
            )}
        </div>
    )
}
