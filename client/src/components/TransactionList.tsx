import {
    Box,
    Paper,
    Typography,
    IconButton,
    Stack,
    Divider,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Transaction } from '../types'
import useCurrency from '../hooks/useCurrency'

interface Props {
    transactions: Transaction[]
    onEdit: (tx: Transaction) => void
    onDelete: (id: string) => void
}

export default function TransactionList({
    transactions,
    onEdit,
    onDelete,
}: Props) {
    const currency = useCurrency()
    if (transactions.length === 0) {
        return (
            <Typography variant="body1" textAlign="center" mt={2}>
                No transactions found.
            </Typography>
        )
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Transactions
            </Typography>

            <Stack spacing={2}>
                {transactions.map((tx) => (
                    <Paper
                        key={tx._id}
                        elevation={2}
                        sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {tx.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(tx.date).toLocaleDateString('en-GB')}{' '}
                                • {tx.type}
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                                variant="subtitle1"
                                color={tx.type === 'income' ? 'green' : 'red'}
                                fontWeight={600}
                            >
                                {currency} {tx.amount.toFixed(2)}
                            </Typography>

                            <IconButton
                                color="warning"
                                onClick={() => onEdit(tx)}
                                size="small"
                            >
                                <EditIcon />
                            </IconButton>

                            <IconButton
                                color="error"
                                onClick={() => onDelete(tx._id)}
                                size="small"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                ))}
            </Stack>
        </Box>
    )
}
