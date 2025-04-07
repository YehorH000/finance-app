import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import { AuthRequest } from '../middlewares/authMiddleware'

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All rows are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res
                .status(409)
                .json({ message: 'User with such email already exist' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        return res.status(201).json({
            message: 'User created successfully',
            userId: newUser._id,
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Write your password and email' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User is not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Password is incorrect' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        })

        return res.status(200).json({
            message: 'Sign in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        console.error('Sign in error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const getCurrentUser = async (
    req: Request & { userId?: string },
    res: Response
) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' })
        }
        res.json(user)
    } catch (error) {
        console.error('Ошибка получения текущего пользователя:', error)
        res.status(500).json({ message: 'Ошибка сервера' })
    }
}

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email } = req.body

        if (!name || !email) {
            return res
                .status(400)
                .json({ message: 'Name and email are required' })
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { name, email },
            { new: true, runValidators: true, select: '-password' }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json(updatedUser)
    } catch (err) {
        console.error('Profile update error:', err)
        res.status(500).json({ message: 'Server error' })
    }
}

export const updateUserPassword = async (req: AuthRequest, res: Response) => {
    try {
        const { password } = req.body

        if (!password || password.length < 6) {
            return res
                .status(400)
                .json({ message: 'Password must be at least 6 characters' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.findByIdAndUpdate(
            req.userId,
            { password: hashedPassword },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({ message: 'Password updated' })
    } catch (err) {
        console.error('Password update error:', err)
        res.status(500).json({ message: 'Server error' })
    }
}

export const deleteUserAccount = async (req: AuthRequest, res: Response) => {
    try {
        await User.findByIdAndDelete(req.userId)
        res.status(200).json({ message: 'Account deleted' })
    } catch (err) {
        console.error('Account deletion error:', err)
        res.status(500).json({ message: 'Server error' })
    }
}
