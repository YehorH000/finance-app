import React, { createContext, useContext, useEffect, useState } from 'react'

interface CurrencyContextType {
    currency: string
    setCurrency: (value: string) => void
}

const CurrencyContext = createContext<CurrencyContextType>({
    currency: '€',
    setCurrency: () => {},
})

export const useCurrency = () => useContext(CurrencyContext)

export const CurrencyProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [currency, setCurrencyState] = useState('€')

    useEffect(() => {
        const stored = localStorage.getItem('currency') || '€'
        setCurrencyState(stored)
    }, [])

    const setCurrency = (value: string) => {
        setCurrencyState(value)
        localStorage.setItem('currency', value)
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    )
}
