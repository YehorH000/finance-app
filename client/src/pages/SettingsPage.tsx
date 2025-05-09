import React, { useState, useEffect } from 'react'
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    FormControlLabel,
    Switch,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCurrency } from '../context/CurrencyContext'
import { useThemeMode } from '../context/ThemeContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function SettingsPage() {
    const { user, setUser } = useUser()
    const navigate = useNavigate()

    const [name, setName] = useState(user?.name || '')
    const [email, setEmail] = useState(user?.email || '')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [hasPassword, setHasPassword] = useState(true)

    const [isLoading, setIsLoading] = useState(false)
    const { currency, setCurrency } = useCurrency()

    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const [verifying2FA, setVerifying2FA] = useState(false)
    const [loading2FA, setLoading2FA] = useState(false)

    const token = localStorage.getItem('token')

    const { mode, toggleTheme } = useThemeMode()

    const handleUpdateProfile = async () => {
        if (!name || !email) return toast.error('Name and email are required')

        try {
            setIsLoading(true)

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/auth/user`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, email }),
                }
            )

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Update failed')

            toast.success('Profile updated')
            setUser(data)
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangePassword = async () => {
        if (!password || password !== confirmPassword) {
            return toast.error('Passwords do not match')
        }

        try {
            setIsLoading(true)

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/auth/user/password`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ password }),
                }
            )

            const data = await res.json()
            if (!res.ok)
                throw new Error(data.message || 'Password update failed')

            toast.success('Password updated')
            setPassword('')
            setConfirmPassword('')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account?'
        )
        if (!confirmed) return

        try {
            setIsLoading(true)

            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/auth/user`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!res.ok) throw new Error('Account deletion failed')

            toast.success('Account deleted')
            localStorage.removeItem('token')
            setUser(null)
            navigate('/')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/')
    }

    const handleExit = () => {
        navigate('/dashboard')
    }

    const handleBack = () => {
        navigate('/dashboard')
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${process.env.REACT_APP_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const user = data?.user
                if (user) {
                    setTwoFactorEnabled(user.isTwoFactorEnabled)
                    setHasPassword(!!user.password)
                } else {
                    throw new Error('User object missing in response')
                }
            })
            .catch((err) => {
                console.error('Failed to load 2FA status:', err)
            })
    }, [])

    // const enable2FA = async () => {
    //     const token = localStorage.getItem('token')
    //     setVerifying2FA(true)

    //     const res = await fetch(
    //         `${process.env.REACT_APP_API_URL}/auth/2fa/generate`,
    //         {
    //             method: 'POST',
    //             headers: { Authorization: `Bearer ${token}` },
    //         }
    //     )

    //     const data = await res.json()

    //     if (res.ok) {
    //         localStorage.setItem('temp2faSecret', data.secret)
    //         localStorage.setItem('temp2faQr', data.qr)
    //         navigate('/2fa-setup')
    //     }

    //     setVerifying2FA(false)
    // }

    // const disable2FA = async () => {
    //     const token = localStorage.getItem('token')
    //     const res = await fetch(
    //         `${process.env.REACT_APP_API_URL}/auth/2fa/disable`,
    //         {
    //             method: 'POST',
    //             headers: { Authorization: `Bearer ${token}` },
    //         }
    //     )

    //     if (res.ok) {
    //         setTwoFactorEnabled(false)
    //     }
    // }

    const handleEnable2FA = async () => {
        setLoading2FA(true)
        const token = localStorage.getItem('token')

        const res = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/2fa/generate`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        const data = await res.json()
        if (res.ok) {
            localStorage.setItem('temp2faSecret', data.secret)
            localStorage.setItem('temp2faQr', data.qr)
            navigate('/2fa-setup') // ты уже используешь эту страницу
        }

        setLoading2FA(false)
    }

    const handleDisable2FA = async () => {
        setLoading2FA(true)
        const token = localStorage.getItem('token')

        const res = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/2fa/disable`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (res.ok) {
            setTwoFactorEnabled(false)
        }

        setLoading2FA(false)
    }

    return (
        <>
            <Button
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    left: 16,
                    backgroundColor: '#f5f5f5',
                    color: 'black',
                    textTransform: 'none',
                    border: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        backgroundColor: '#e0e0e0',
                    },
                }}
            >
                Dashboard
            </Button>
            <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Account Settings
                    </Typography>

                    <Box mb={2}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>

                    <Box mb={2}>
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Box>

                    <Box mb={3}>
                        <Button
                            variant="contained"
                            onClick={handleUpdateProfile}
                            disabled={isLoading}
                            fullWidth
                        >
                            Save Changes
                        </Button>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" gutterBottom>
                        {hasPassword ? 'Change Password' : 'Set a Password'}
                    </Typography>

                    <Box mb={2}>
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>

                    <Box mb={2}>
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Box>

                    <Box mb={3}>
                        <Button
                            variant="outlined"
                            onClick={handleChangePassword}
                            disabled={isLoading}
                            fullWidth
                        >
                            Update Password
                        </Button>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" gutterBottom>
                        Currency
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="currency-label">Currency</InputLabel>
                        <Select
                            labelId="currency-label"
                            value={currency}
                            label="Currency"
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <MenuItem value="€">Euro (€)</MenuItem>
                            <MenuItem value="$">Dollar ($)</MenuItem>
                            <MenuItem value="₴">Hryvnia (₴)</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider sx={{ my: 4 }} />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={mode === 'dark'}
                                onChange={toggleTheme}
                            />
                        }
                        label="Enable dark theme"
                    />

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" gutterBottom>
                        Two-Factor Authentication
                    </Typography>

                    {twoFactorEnabled ? (
                        <Button
                            variant="outlined"
                            onClick={handleDisable2FA}
                            disabled={loading2FA}
                        >
                            {loading2FA ? 'Disabling...' : 'Disable 2FA'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleEnable2FA}
                            disabled={loading2FA}
                        >
                            {loading2FA ? 'Preparing...' : 'Enable 2FA'}
                        </Button>
                    )}

                    <Divider sx={{ my: 4 }} />

                    <Typography variant="h6" gutterBottom>
                        Danger Zone
                    </Typography>

                    <Box mb={2}>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            fullWidth
                        >
                            Delete Account
                        </Button>
                    </Box>

                    <Box>
                        <Button
                            variant="text"
                            color="secondary"
                            onClick={handleLogout}
                            fullWidth
                        >
                            Log Out
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}
