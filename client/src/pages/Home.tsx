import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Button, Typography, Box, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()
    const theme = useTheme()

    return (
        <Container className="d-flex vh-100">
            <Row className="m-auto w-100 align-items-center justify-content-center">
                <Col md={8} lg={6}>
                    <Box
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: 2,
                            boxShadow: 3,
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Finance Tracker
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Manage your personal finances, track your expenses
                            and gain insights — all in one place.
                        </Typography>

                        <Box
                            sx={{
                                mt: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="large"
                                onClick={() => navigate('/register')}
                            >
                                Register
                            </Button>
                        </Box>
                    </Box>
                </Col>
            </Row>
        </Container>
    )
}
