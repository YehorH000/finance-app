import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const Loader = () => (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100px"
    >
        <CircularProgress />
    </Box>
)

export default Loader
