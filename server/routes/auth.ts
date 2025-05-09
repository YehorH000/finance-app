import express, { Request, Response } from 'express'
import {
    registerUser,
    loginUser,
    getCurrentUser,
    updateUserProfile,
    updateUserPassword,
    deleteUserAccount,
} from '../controllers/authController'
import { protect } from '../middlewares/authMiddleware'
import {
    generate2FA,
    verify2FA,
    verifyAndEnable2FA,
} from '../controllers/twoFactorController'
import User from '../models/User'
import { googleOAuthCallback } from '../controllers/oauthController'

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

// router.get('/me', protect, async (req, res) => {
//     try {
//         await getCurrentUser(req, res) // Ensure getCurrentUser is an async function if it performs async operations
//     } catch (error) {
//         console.error('Error in /me route:', error)
//         res.status(500).json({ message: 'Internal Server Error' })
//     }
// })

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

router.post('/2fa/generate', generate2FA)
router.post('/2fa/verify', verify2FA)
router.post('/2fa/disable', protect, async (req: Request, res: Response) => {
    const user = await User.findById((req as any).userId)
    if (!user) {
        res.status(404).json({ message: 'User not found' })
        return
    }

    user.isTwoFactorEnabled = false
    user.twoFactorSecret = ''
    await user.save()

    res.json({ message: '2FA disabled' })
})

router.get('/me', protect, async (req: Request, res: Response) => {
    const user = await User.findById((req as any).userId)
    if (!user) {
        res.status(404).json({ message: 'User not found' })
        return
    }

    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isTwoFactorEnabled: user.isTwoFactorEnabled,
        },
    })
})
router.post('/2fa/enable', protect, verifyAndEnable2FA)

router.get('/google/callback', googleOAuthCallback)

export default router
