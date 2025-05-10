import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import {
    Box,
    TextField,
    Typography,
    Button,
    Paper,
    Link,
    Alert,
} from '@mui/material'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { setUser } = useUser()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Login failed')
                return
            }

            if (res.status === 206) {
                localStorage.setItem('pendingUserId', data.userId)
                navigate('/2fa')
                return
            }

            localStorage.setItem('token', data.token)
            setUser(data.user)
            navigate('/dashboard')
        } catch (err) {
            setError('Connection error')
            console.error(err)
        }
    }

    return (
        <Box className="d-flex vh-100 justify-content-center align-items-center bg-light">
            <Paper elevation={3} sx={{ p: 4, width: 350 }}>
                <Typography variant="h5" gutterBottom textAlign="center">
                    Login to Finance App
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                        const googleClientId =
                            process.env.REACT_APP_GOOGLE_CLIENT_ID
                        // const redirectUri =
                        //     'http://localhost:5000/api/auth/google/callback'

                        const redirectUri =
                            'https://finance-app-backend-5fja.onrender.com/api/auth/google/callback'

                        const scope =
                            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'

                        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(
                            scope
                        )}&access_type=offline&prompt=consent`

                        window.location.href = authUrl
                    }}
                >
                    Sign in with Google
                </Button>

                <Box mt={2} textAlign="center">
                    <Link href="/" underline="hover">
                        ← Back to Home
                    </Link>
                </Box>
            </Paper>
        </Box>
    )
}
