import { Box, Paper, Typography } from '@mui/material'
import { Transaction } from '../types'
import useCurrency from '../hooks/useCurrency'

interface Props {
    transactions: Transaction[]
}

export default function BalanceSummary({ transactions }: Props) {
    const income = transactions
        .filter((tx) => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0)

    const expense = transactions
        .filter((tx) => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0)

    const balance = income - expense
    const currency = useCurrency()

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Balance Overview
            </Typography>

            <Box display="flex" justifyContent="space-between">
                <Box>
                    <Typography variant="body1">Income:</Typography>
                    <Typography color="green" fontWeight={600}>
                        {currency} {income.toFixed(2)}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body1">Expense:</Typography>
                    <Typography color="red" fontWeight={600}>
                        {currency} {expense.toFixed(2)}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="body1">Balance:</Typography>
                    <Typography fontWeight={600}>
                        {currency} {balance.toFixed(2)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    )
}
