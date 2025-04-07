export type TransactionType = 'income' | 'expense'

export interface Transaction {
    _id: string
    amount: number
    category: string
    date: string
    type: TransactionType
    createdAt?: string
}

export interface TransactionFormData {
    amount: string
    type: TransactionType
    category: string
    date: string
}
