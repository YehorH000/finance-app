import { useEffect, useState } from 'react'
import { TextField, Button, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function TwoFactorSetup() {
    const [qrCode, setQrCode] = useState('')
    const [secret, setSecret] = useState('')
    const [token, setToken] = useState('')
    const [error, setError] = useState('')
    const tokenValue = localStorage.getItem('token')
    const [code, setCode] = useState('')

    const navigate = useNavigate()
    const storedSecret = localStorage.getItem('temp2faSecret') || ''

    useEffect(() => {
        const qr = localStorage.getItem('temp2faQr')
        const secret = localStorage.getItem('temp2faSecret')
        if (!qr || !secret) {
            setError('Something went wrong. Please try enabling 2FA again.')
            navigate('/settings')
            return
        }
        setQrCode(qr)
        setSecret(secret)
    }, [])

    const handleVerify = async () => {
        const token = localStorage.getItem('token')

        const res = await fetch(
            `${process.env.REACT_APP_API_URL}/auth/2fa/enable`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token: code, secret }),
            }
        )

        const data = await res.json()

        if (!res.ok) {
            setError(data.message || 'Verification failed')
            return
        }

        localStorage.removeItem('temp2faSecret')
        localStorage.removeItem('temp2faQr')
        navigate('/settings')
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                2FA Setup
            </Typography>

            {qrCode && (
                <img src={qrCode} alt="QR Code" style={{ width: 200 }} />
            )}

            <TextField
                label="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fullWidth
                sx={{ mt: 2 }}
            />

            {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}

            <Button
                onClick={handleVerify}
                variant="contained"
                sx={{ mt: 2 }}
                fullWidth
            >
                Verify
            </Button>
        </Box>
    )
}
