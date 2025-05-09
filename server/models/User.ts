import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        oauth: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            validate: {
                validator: function (this: any, value: string) {
                    if (!this.oauth) {
                        return typeof value === 'string' && value.length >= 6
                    }
                    return true
                },
                message:
                    'Password is required and must be at least 6 characters long if OAuth is not used.',
            },
        },
        provider: {
            type: String,
            default: 'local',
        },
        twoFactorSecret: {
            type: String,
            default: null,
        },
        isTwoFactorEnabled: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model('User', userSchema)

export default User
