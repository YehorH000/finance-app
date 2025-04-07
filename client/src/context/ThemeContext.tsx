import React, { createContext, useContext, useEffect, useState } from 'react'
import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
    CssBaseline,
} from '@mui/material'

interface ThemeContextType {
    mode: 'light' | 'dark'
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    mode: 'light',
    toggleTheme: () => {},
})

export const useThemeMode = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const stored = localStorage.getItem('theme') as 'light' | 'dark'
        if (stored) setMode(stored)
    }, [])

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light'
        setMode(newMode)
        localStorage.setItem('theme', newMode)
    }

    const theme = createTheme({ palette: { mode } })

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}
