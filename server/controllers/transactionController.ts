import { Request, Response } from 'express'
import Transaction from '../models/Transaction'
import { AuthRequest } from '../middlewares/authMiddleware'

export const addTransaction = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { amount, type, category, date } = req.body

        if (!amount || !type || !category || !date) {
            res.status(400).json({ message: 'All rows are required' })
            return
        }

        const newTransaction = await Transaction.create({
            amount,
            type,
            category,
            date,
            user: req.userId,
        })

        res.status(201).json({
            message: 'Transaction created',
            transaction: newTransaction,
        })
    } catch (error) {
        console.error('Transaction creating error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const getTransactions = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const transactions = await Transaction.find({ user: req.userId }).sort({
            date: -1,
        })
        res.status(200).json(transactions)
    } catch (error) {
        console.error('Transaction error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const deleteTransaction = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params

        const deleted = await Transaction.findOneAndDelete({
            _id: id,
            user: req.userId,
        })

        if (!deleted) {
            res.status(404).json({
                message: 'Transaction not found or not yours',
            })
            return
        }

        res.status(200).json({ message: 'Transaction deleted' })
    } catch (error) {
        console.error('Delete error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const updateTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const updated = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        )

        if (!updated) {
            res.status(404).json({ message: 'Not found or not yours' })
            return
        }

        res.status(200).json({ message: 'Updated', transaction: updated })
    } catch (error) {
        console.error('Update error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}
