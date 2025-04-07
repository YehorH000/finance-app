import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert'
import BalanceSummary from '../components/BalanceSummary'
import TransactionForm from '../components/TransactionForm'
import FilterSelector from '../components/FilterSelector'
import ChartSelector from '../components/ChartSelector'
import PieChartComponent from '../components/PieChartComponent'
import LineChartComponent from '../components/LineChartComponent'
import TransactionList from '../components/TransactionList'
import { TransactionFormData } from '../types'
import AddTransactionWidget from '../components/AddTransactionWidget'
import EditTransactionModal from '../components/EditTransactionModal'

interface Transaction {
    _id: string
    amount: number
    type: 'income' | 'expense'
    category: string
    date: string
}

export default function Dashboard() {
    const { user } = useUser()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [error, setError] = useState('')
    // const [chartType, setChartType] = useState<'pie' | 'line'>('pie')
    // const [pieMode, setPieMode] = useState<'income' | 'expense'>('income')
    const [form, setForm] = useState<TransactionFormData>({
        amount: '',
        type: 'expense',
        category: '',
        date: '',
    })
    const [chartMode, setChartMode] = useState<
        'pie-income' | 'pie-expense' | 'line'
    >('pie-income')
    const [editModalOpen, setEditModalOpen] = useState(false)

    const [editMode, setEditMode] = useState(false)
    const [editTxId, setEditTxId] = useState<string | null>(null)
    const [filterMode, setFilterMode] = useState<'all' | 'month' | 'week'>(
        'all'
    )
    const isFormDirty = !!form.amount || !!form.category || !!form.date

    const now = new Date()

    const isSameWeek = (date: Date) => {
        const dayOfWeek = now.getDay()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
        startOfWeek.setHours(0, 0, 0, 0)
        const endOfWeek = new Date(now)
        endOfWeek.setHours(23, 59, 59, 999)
        return date >= startOfWeek && date <= endOfWeek
    }

    const isSameMonth = (date: Date) => {
        return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        )
    }

    const filteredTransactions = transactions.filter((tx) => {
        const date = new Date(tx.date)
        if (filterMode === 'all') return true
        if (filterMode === 'week') return isSameWeek(date)
        if (filterMode === 'month') return isSameMonth(date)
        return true
    })

    const token = localStorage.getItem('token')

    const incomeMap = filteredTransactions
        .filter((tx) => tx.type === 'income')
        .reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount
            return acc
        }, {} as Record<string, number>)

    const expenseMap = filteredTransactions
        .filter((tx) => tx.type === 'expense')
        .reduce((acc, tx) => {
            acc[tx.category] = (acc[tx.category] || 0) + tx.amount
            return acc
        }, {} as Record<string, number>)

    const pieDataIncome = Object.entries(incomeMap).map(
        ([category, amount]) => ({
            name: category,
            value: amount,
        })
    )

    const pieDataExpense = Object.entries(expenseMap).map(
        ([category, amount]) => ({
            name: category,
            value: amount,
        })
    )

    const lineMap: Record<
        string,
        { date: string; income: number; expense: number }
    > = {}

    filteredTransactions.forEach((tx) => {
        const date = new Date(tx.date).toLocaleDateString()
        if (!lineMap[date]) {
            lineMap[date] = { date, income: 0, expense: 0 }
        }
        lineMap[date][tx.type] += tx.amount
    })

    const lineData = Object.values(lineMap).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    useEffect(() => {
        if (!token) return

        fetch(`${process.env.REACT_APP_API_URL}/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => setTransactions(data))
            .catch(() => setError('Can not fetch transactions'))
    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return

        try {
            const url = editMode
                ? `${process.env.REACT_APP_API_URL}/transactions/${editTxId}`
                : `${process.env.REACT_APP_API_URL}/transactions`

            const method = editMode ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.message || 'Something went wrong')
                return
            }

            if (editMode) {
                setTransactions((prev) =>
                    prev.map((tx) =>
                        tx._id === editTxId ? data.transaction : tx
                    )
                )
            } else {
                setTransactions((prev) => [data.transaction, ...prev])
            }

            setForm({ amount: '', type: 'expense', category: '', date: '' })
            setEditMode(false)
            setEditTxId(null)
        } catch (err) {
            console.error(err)
            toast.error('Error submitting transaction')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/transactions/${id}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            if (!res.ok) {
                toast.error('Failed to delete')
                return
            }

            setTransactions((prev) => prev.filter((tx) => tx._id !== id))
            toast.success('Transaction deleted')
        } catch (err) {
            console.error(err)
            toast.error('Error while deleting')
        }
    }

    const confirmDelete = (id: string) => {
        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this transaction?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => handleDelete(id),
                },
                {
                    label: 'No',
                    onClick: () => {},
                },
            ],
        })
    }

    const handleEdit = (tx: Transaction) => {
        setEditMode(true)
        setEditTxId(tx._id)
        setForm({
            amount: tx.amount.toString(),
            type: tx.type,
            category: tx.category,
            date: tx.date.slice(0, 10),
        })
        setEditModalOpen(true)
    }

    // Calculate balance, total income, and total expense
    const totalIncome = transactions
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0)

    const totalExpense = transactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0)

    const balance = totalIncome - totalExpense

    type TransactionFormData = {
        amount: string
        type: 'income' | 'expense'
        category: string
        date: string
    }

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem' }}>
            <h2>Hello, {user?.name}!</h2>

            <BalanceSummary transactions={filteredTransactions} />

            <div id="transaction-form">
                <TransactionForm
                    formData={form}
                    setFormData={setForm}
                    editMode={editMode}
                    editTxId={editTxId}
                    onSubmit={handleSubmit}
                    onCancelEdit={() => {
                        setEditMode(false)
                        setEditTxId(null)
                        setForm({
                            amount: '',
                            type: 'expense',
                            category: '',
                            date: '',
                        })
                    }}
                />
            </div>

            <FilterSelector
                filterMode={filterMode}
                setFilterMode={setFilterMode}
            />

            <ChartSelector chartMode={chartMode} setChartMode={setChartMode} />

            {chartMode === 'pie-income' && (
                <PieChartComponent
                    pieMode="income"
                    setPieMode={() => {}}
                    pieDataIncome={pieDataIncome}
                    pieDataExpense={pieDataExpense}
                />
            )}

            {chartMode === 'pie-expense' && (
                <PieChartComponent
                    pieMode="expense"
                    setPieMode={() => {}}
                    pieDataIncome={pieDataIncome}
                    pieDataExpense={pieDataExpense}
                />
            )}

            {chartMode === 'line' && <LineChartComponent lineData={lineData} />}

            <h3>Your Transactions:</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <TransactionList
                transactions={filteredTransactions}
                onEdit={handleEdit}
                onDelete={confirmDelete}
            />

            <AddTransactionWidget
                onSubmit={handleSubmit}
                formData={form}
                setFormData={setForm}
            />

            <EditTransactionModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                formData={form}
                setFormData={setForm}
                editMode={editMode}
                editTxId={editTxId}
                onSubmit={handleSubmit}
                onCancelEdit={() => {
                    setEditMode(false)
                    setEditTxId(null)
                    setForm({
                        amount: '',
                        type: 'expense',
                        category: '',
                        date: '',
                    })
                }}
            />
        </div>
    )
}
