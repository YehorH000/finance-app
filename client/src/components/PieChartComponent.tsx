import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Paper, Typography, Box } from '@mui/material'

interface Props {
    pieMode: 'income' | 'expense'
    setPieMode: (mode: 'income' | 'expense') => void
    pieDataIncome: { name: string; value: number }[]
    pieDataExpense: { name: string; value: number }[]
}

const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8E44AD',
    '#E74C3C',
]

export default function PieChartComponent({
    pieMode,
    setPieMode,
    pieDataIncome,
    pieDataExpense,
}: Props) {
    const data = pieMode === 'income' ? pieDataIncome : pieDataExpense

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                {pieMode === 'income'
                    ? 'Income by Category'
                    : 'Expenses by Category'}
            </Typography>

            <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    )
}
