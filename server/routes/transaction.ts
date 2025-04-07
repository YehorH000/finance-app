import express from 'express'
import {
    addTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from '../controllers/transactionController'
import { protect } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/transactions', protect, addTransaction)
router.get('/transactions', protect, getTransactions)
router.delete('/transactions/:id', protect, deleteTransaction)
router.put('/transactions/:id', protect, updateTransaction)

export default router
