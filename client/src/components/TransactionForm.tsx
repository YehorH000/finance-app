import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Paper,
} from '@mui/material'
import CategorySelector from './CategorySelector'

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
}

export default function TransactionForm({
    editMode,
    editTxId,
    formData,
    setFormData,
    onSubmit,
    onCancelEdit,
}: Props) {
    const isFormDirty =
        !!formData.amount || !!formData.category || !!formData.date

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                {editMode ? 'Edit Transaction' : 'Add New Transaction'}
            </Typography>

            <Box component="form" onSubmit={onSubmit}>
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

                {/* 🆕 Замена TextField на кастомный CategorySelector */}
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

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {editMode ? 'Update' : 'Add'}
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
        </Paper>
    )
}
