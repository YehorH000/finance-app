import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'

interface User {
    id: string
    name: string
    email: string
}

interface UserContextType {
    user: User | null
    setUser: (user: User | null) => void
    fetchUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    fetchUser: async () => {},
})

export const useUser = () => useContext(UserContext)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    const fetchUser = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/auth/me`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            const data = await res.json()

            if (res.ok && data.user) {
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch (err) {
            console.error('Failed to fetch user:', err)
            setUser(null)
        }
        // console.log('[UserContext] Fetching /auth/me with token:', token)
    }

    useEffect(() => {
        console.log('[UserContext] Loading user...')
        fetchUser()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, fetchUser }}>
            {children}
        </UserContext.Provider>
    )
}
