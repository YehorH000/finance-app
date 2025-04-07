import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'
import { Paper, Typography, Box } from '@mui/material'

interface Props {
    lineData: {
        date: string
        income: number
        expense: number
    }[]
}

export default function LineChartComponent({ lineData }: Props) {
    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Income & Expenses Over Time
            </Typography>

            <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#4CAF50"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#F44336"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    )
}
