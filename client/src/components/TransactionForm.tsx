import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Paper,
} from '@mui/material'
import CategorySelector from './CategorySelector'
import { useState } from 'react'
import AdvancedTransactionModal from './AdvancedTransactionModal'

interface Props {
    editMode: boolean
    editTxId: string | null
    formData: {
        amount: string
        type: 'income' | 'expense'
        category: string
        date: string
    }
    setFormData: React.Dispatch<
        React.SetStateAction<{
            amount: string
            type: 'income' | 'expense'
            category: string
            date: string
        }>
    >
    onSubmit: (e: React.FormEvent) => void
    onCancelEdit: () => void
    onOpenAdvanced?: () => void
    onAddTransaction?: (newTx: any) => void
}

export default function TransactionForm({
    editMode,
    editTxId,
    formData,
    setFormData,
    onSubmit,
    onCancelEdit,
    onOpenAdvanced,
    onAddTransaction,
}: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [openAdvanced, setOpenAdvanced] = useState(false)

    const isFormDirty =
        !!formData.amount || !!formData.category || !!formData.date

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await onSubmit(e)
        } catch (err: any) {
            console.error(err)
            setError('Something went wrong while submitting.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {editMode ? 'Edit Transaction' : 'Add New Transaction'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Amount"
                        name="amount"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        select
                        label="Type"
                        name="type"
                        fullWidth
                        margin="normal"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                    </TextField>

                    <Box mt={2} mb={2}>
                        <CategorySelector
                            value={formData.category}
                            onChange={(val) =>
                                setFormData({ ...formData, category: val })
                            }
                        />
                    </Box>

                    <TextField
                        label="Date"
                        name="date"
                        type="date"
                        fullWidth
                        margin="normal"
                        value={formData.date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading
                            ? 'Submitting...'
                            : editMode
                            ? 'Update'
                            : 'Add'}
                    </Button>

                    {isFormDirty && (
                        <Button
                            onClick={onCancelEdit}
                            variant="text"
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            {editMode ? 'Cancel Edit' : 'Clear Form'}
                        </Button>
                    )}
                </Box>

                {onOpenAdvanced && (
                    <Button
                        onClick={() => setOpenAdvanced(true)}
                        variant="text"
                        size="small"
                        sx={{
                            mt: 1,
                            color: 'gray',
                            textTransform: 'none',
                            '&:hover': {
                                color: 'black',
                                backgroundColor: '#f0f0f0',
                            },
                        }}
                    >
                        Advanced Add
                    </Button>
                )}
            </Paper>

            <AdvancedTransactionModal
                open={openAdvanced}
                onClose={() => setOpenAdvanced(false)}
                onSubmit={(newTx) => {
                    console.log('Advanced submitted:', newTx)
                    if (onAddTransaction) {
                        onAddTransaction(newTx) // Call the callback to update transactions
                    }
                    setOpenAdvanced(false)
                }}
            />
        </>
    )
}
