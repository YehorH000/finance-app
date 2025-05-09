import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const generate2FA = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const secret = speakeasy.generateSecret({ name: 'FinanceApp' })

        if (!secret.otpauth_url) {
            res.status(500).json({ message: 'Failed to generate OTP Auth URL' })
            return
        }

        const qr = await qrcode.toDataURL(secret.otpauth_url)

        res.json({ secret: secret.base32, qr })
    } catch (error) {
        console.error('Error generating 2FA:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const verify2FA = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, token } = req.body

        if (!userId || !token) {
            res.status(400).json({ message: 'User ID and token are required' })
            return
        }

        const user = await User.findById(userId)
        if (!user || !user.twoFactorSecret) {
            res.status(400).json({ message: 'Invalid user or no 2FA setup' })
            return
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
            window: 1,
        })

        if (!verified) {
            res.status(401).json({ message: 'Invalid code' })
            return
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        })

        res.json({
            message: '2FA verified',
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        console.error('Error verifying 2FA:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

export const verifyAndEnable2FA = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { token, secret } = req.body
        const userId = (req as any).userId

        if (!token || !secret) {
            res.status(400).json({ message: 'Token and secret are required' })
            return
        }

        const user = await User.findById(userId)
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1,
        })

        if (!verified) {
            res.status(401).json({ message: 'Invalid token' })
            return
        }

        user.twoFactorSecret = secret
        user.isTwoFactorEnabled = true
        await user.save()

        res.json({ message: '2FA enabled successfully' })
    } catch (error) {
        console.error('Error enabling 2FA:', error)
        res.status(500).json({ message: 'Server error' })
    }
}
