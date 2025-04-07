import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    Box,
    TextField,
    Typography,
    Button,
    Paper,
    Link,
    Alert,
} from '@mui/material'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                }
            )

            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Registration failed')
                return
            }

            toast.success('Registration successful! You can now log in.')
            navigate('/login')
        } catch (err) {
            console.error(err)
            setError('Server error. Please try again later.')
        }
    }

    return (
        <Box className="d-flex vh-100 justify-content-center align-items-center bg-light">
            <Paper elevation={3} sx={{ p: 4, width: 350 }}>
                <Typography variant="h5" gutterBottom textAlign="center">
                    Create Account
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        margin="normal"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Sign Up
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
