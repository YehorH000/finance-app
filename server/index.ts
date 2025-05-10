import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import transactionRoutes from './routes/transaction'
import helmet from 'helmet'

dotenv.config()
connectDB()

const app = express()

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'https://apis.google.com'],
                connectSrc: ["'self'", 'https://www.googleapis.com'],
                imgSrc: ["'self'", 'data:', 'https://www.gstatic.com'],
                styleSrc: ["'self'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            },
        },
    })
)

app.use(
    cors({
        origin: ['https://finance-app-client-usqr.onrender.com'],
        credentials: true,
    })
)
app.use(express.json())

// app.use('/api', authRoutes)
app.use('/api/auth', authRoutes)
app.use('/api', transactionRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
