import React from 'react'
import { Modal, Box, Typography, IconButton, Avatar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
    open: boolean
    onClose: () => void
    transaction: {
        amount: number
        type: 'income' | 'expense'
        category: string
        date: string
        description?: string
        icon?: JSX.Element
    } | null
}

export default function TransactionDetailsModal({
    open,
    onClose,
    transaction,
}: Props) {
    if (!transaction) return null

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    width: '90%',
                    maxWidth: 400,
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 24,
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" gutterBottom>
                    Transaction Details
                </Typography>

                <Box mt={2}>
                    <Typography>
                        <strong>Type:</strong> {transaction.type}
                    </Typography>
                    <Typography>
                        <strong>Amount:</strong> {transaction.amount}
                    </Typography>
                    <Typography>
                        <strong>Category:</strong> {transaction.category}
                    </Typography>
                    <Typography>
                        <strong>Date:</strong>{' '}
                        {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                    {transaction.description && (
                        <Typography>
                            <strong>Comment:</strong> {transaction.description}
                        </Typography>
                    )}
                </Box>

                {transaction.icon && (
                    <Box mt={2} display="flex" alignItems="center" gap={1}>
                        <Typography>Icon:</Typography>
                        <Avatar>{transaction.icon}</Avatar>
                    </Box>
                )}
            </Box>
        </Modal>
    )
}
