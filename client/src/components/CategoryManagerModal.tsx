import React, { useState, useEffect } from 'react'
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    Avatar,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CategoryIcon from '@mui/icons-material/Category'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import TheatersIcon from '@mui/icons-material/Theaters'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const iconOptions = [
    { label: 'Food', icon: <RestaurantIcon /> },
    { label: 'Transport', icon: <DirectionsCarIcon /> },
    { label: 'Health', icon: <MedicalServicesIcon /> },
    { label: 'Entertainment', icon: <TheatersIcon /> },
    { label: 'Shopping', icon: <ShoppingBagIcon /> },
    { label: 'Default', icon: <CategoryIcon /> },
]

interface Props {
    open: boolean
    onClose: () => void
    onSave: (category: { name: string; icon: JSX.Element }) => void
}

export default function CategoryManagerModal({ open, onClose, onSave }: Props) {
    const [name, setName] = useState('')
    const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].label)

    useEffect(() => {
        setName('')
        setSelectedIcon(iconOptions[0].label)
    }, [open])

    const handleSubmit = () => {
        const iconEntry = iconOptions.find((opt) => opt.label === selectedIcon)
        if (name.trim() && iconEntry) {
            onSave({ name: name.trim(), icon: iconEntry.icon })
            onClose()
        }
    }

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
                    Add Custom Category
                </Typography>

                <TextField
                    label="Category Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Typography variant="subtitle1" gutterBottom>
                    Choose Icon
                </Typography>

                <Grid container spacing={2}>
                    {iconOptions.map((opt) => (
                        <Grid item xs={4} key={opt.label}>
                            <Button
                                variant={
                                    selectedIcon === opt.label
                                        ? 'contained'
                                        : 'outlined'
                                }
                                fullWidth
                                onClick={() => setSelectedIcon(opt.label)}
                                sx={{ flexDirection: 'column', py: 2 }}
                            >
                                <Avatar sx={{ mb: 1 }}>{opt.icon}</Avatar>
                                <Typography variant="caption">
                                    {opt.label}
                                </Typography>
                            </Button>
                        </Grid>
                    ))}
                </Grid>

                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleSubmit}
                    sx={{ mt: 3, borderRadius: 999 }}
                >
                    Save Category
                </Button>
            </Box>
        </Modal>
    )
}
