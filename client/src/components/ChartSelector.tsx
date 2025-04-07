import { Box, Button, ButtonGroup, Typography } from '@mui/material'

interface Props {
    chartMode: 'pie-income' | 'pie-expense' | 'line'
    setChartMode: (mode: Props['chartMode']) => void
}

export default function ChartSelector({ chartMode, setChartMode }: Props) {
    return (
        <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
                Select Chart:
            </Typography>
            <ButtonGroup variant="outlined" color="primary">
                <Button
                    variant={
                        chartMode === 'pie-income' ? 'contained' : 'outlined'
                    }
                    onClick={() => setChartMode('pie-income')}
                >
                    Income Pie
                </Button>
                <Button
                    variant={
                        chartMode === 'pie-expense' ? 'contained' : 'outlined'
                    }
                    onClick={() => setChartMode('pie-expense')}
                >
                    Expense Pie
                </Button>
                <Button
                    variant={chartMode === 'line' ? 'contained' : 'outlined'}
                    onClick={() => setChartMode('line')}
                >
                    Line Chart
                </Button>
            </ButtonGroup>
        </Box>
    )
}
