import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import transactionRoutes from './routes/transaction'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', transactionRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
