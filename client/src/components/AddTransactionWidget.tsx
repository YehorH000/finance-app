import { useEffect, useState } from 'react'
import { Fab, Zoom, Modal, Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TransactionForm from './TransactionForm'
import { TransactionFormData } from '../types'

interface Props {
    onSubmit: (e: React.FormEvent) => void
    formData: TransactionFormData
    setFormData: React.Dispatch<React.SetStateAction<TransactionFormData>>
}

export default function AddTransactionWidget({
    onSubmit,
    formData,
    setFormData,
}: Props) {
    const [visible, setVisible] = useState(false)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY
            const formElement = document.getElementById('transaction-form')
            const formBottom = formElement?.getBoundingClientRect().bottom || 0
            setVisible(scrollY > formBottom)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <Zoom in={visible}>
                <Fab
                    color="primary"
                    onClick={() => setOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        zIndex: 1000,
                    }}
                >
                    <AddIcon />
                </Fab>
            </Zoom>

            <Modal open={open} onClose={() => setOpen(false)}>
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
                        editMode={false}
                        editTxId={null}
                        onSubmit={(e) => {
                            onSubmit(e)
                            setOpen(false)
                        }}
                        onCancelEdit={() => {
                            setOpen(false)
                        }}
                    />
                </Box>
            </Modal>
        </>
    )
}
