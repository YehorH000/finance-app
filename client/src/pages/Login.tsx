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
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { setUser } = useUser()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Login failed')
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
                        fullWidth
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Log In
                    </Button>
                </form>

                <Box mt={2} textAlign="center">
                    <Link href="/" underline="hover">
                        ← Back to Home
                    </Link>
                </Box>
            </Paper>
        </Box>
    )
}
