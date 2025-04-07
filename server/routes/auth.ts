import express from 'express'
import {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
} from '../controllers/authController'
import { protect } from '../middlewares/authMiddleware'

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        await registerUser(req, res) // Ensure registerUser is an async function if it performs async operations
    } catch (error) {
        console.error('Error in /register route:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.post('/login', async (req, res) => {
    try {
        await loginUser(req, res)
    } catch (error) {
        console.error('Error in /login route:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.get('/me', protect, async (req, res) => {
    try {
        await getCurrentUser(req, res) // Ensure getCurrentUser is an async function if it performs async operations
    } catch (error) {
        console.error('Error in /me route:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.put('/user', protect, async (req, res) => {
    try {
        await updateUserProfile(req, res) // Ensure this function is async
    } catch (error) {
        console.error('Error in /user route:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

router.patch('/user/password', protect, async (req, res) => {
    try {
        await updateUserPassword(req, res) // Ensure this function is async
    } catch (error) {
        console.error('Error in /user/password route:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})
router.delete('/user', protect, deleteUserAccount)

export default router
