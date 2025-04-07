import { Button, ButtonGroup, Typography, Box } from '@mui/material'

interface Props {
    filterMode: 'all' | 'month' | 'week'
    setFilterMode: (mode: 'all' | 'month' | 'week') => void
}

export default function FilterSelector({ filterMode, setFilterMode }: Props) {
    return (
        <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
                Filter by Time:
            </Typography>
            <ButtonGroup variant="outlined" color="primary">
                <Button
                    variant={filterMode === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setFilterMode('all')}
                >
                    All
                </Button>
                <Button
                    variant={filterMode === 'month' ? 'contained' : 'outlined'}
                    onClick={() => setFilterMode('month')}
                >
                    This Month
                </Button>
                <Button
                    variant={filterMode === 'week' ? 'contained' : 'outlined'}
                    onClick={() => setFilterMode('week')}
                >
                    This Week
                </Button>
            </ButtonGroup>
        </Box>
    )
}
