import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function OAuthSuccessHandler() {
    const navigate = useNavigate()
    const { fetchUser } = useUser()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
            localStorage.setItem('token', token)
            fetchUser().then(() => {
                navigate('/dashboard')
            })
        } else {
            navigate('/login')
        }
    }, [])

    return null
}
