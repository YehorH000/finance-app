import { Modal, Box } from '@mui/material'
import TransactionForm from './TransactionForm'
import { TransactionFormData } from '../types'

interface Props {
    open: boolean
    onClose: () => void
    formData: TransactionFormData
    setFormData: React.Dispatch<React.SetStateAction<TransactionFormData>>
    editMode: boolean
    editTxId: string | null
    onSubmit: (e: React.FormEvent) => void
    onCancelEdit: () => void
}

export default function EditTransactionModal({
    open,
    onClose,
    formData,
    setFormData,
    editMode,
    editTxId,
    onSubmit,
    onCancelEdit,
}: Props) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    maxWidth: 500,
                    margin: '10vh auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <TransactionForm
                    formData={formData}
                    setFormData={setFormData}
                    editMode={editMode}
                    editTxId={editTxId}
                    onSubmit={(e) => {
                        onSubmit(e)
                        onClose()
                    }}
                    onCancelEdit={() => {
                        onCancelEdit()
                        onClose()
                    }}
                />
            </Box>
        </Modal>
    )
}
