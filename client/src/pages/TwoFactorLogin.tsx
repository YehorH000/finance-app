import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useUser } from '../context/UserContext'

export default function TwoFactorLogin() {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { fetchUser } = useUser()

    useEffect(() => {
        const userId = localStorage.getItem('pendingUserId')
        if (!userId) {
            navigate('/login')
        }
    }, [])

    const handleSubmit = async () => {
        const userId = localStorage.getItem('pendingUserId')
        if (!userId) {
            setError('No session. Please log in again.')
            navigate('/login')
            return
        }

        const res = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/2fa/verify`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: code, userId }),
            }
        )

        const data = await res.json()

        if (!res.ok || !data.token) {
            setError(data.message || 'Invalid code')
            return
        }

        if (res.ok) {
            localStorage.setItem('token', data.token)
            localStorage.removeItem('pendingUserId')

            await fetchUser()

            navigate('/dashboard')
        }

        // localStorage.setItem('token', data.token)
        // localStorage.removeItem('pendingUserId')
        // navigate('/dashboard')
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Typography variant="h6" gutterBottom>
                Two-Factor Verification
            </Typography>

            <TextField
                label="Enter 6-digit code"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ mt: 2 }}
            />

            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}

            <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
                sx={{ mt: 2 }}
            >
                Verify
            </Button>
        </Box>
    )
}
