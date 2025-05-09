import React, { useState } from 'react'
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Avatar,
    Grid,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import WalletIcon from '@mui/icons-material/AccountBalanceWallet'
import CategorySelectorDialog from './CategorySelectorDialog'

import RestaurantIcon from '@mui/icons-material/Restaurant'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import TheatersIcon from '@mui/icons-material/Theaters'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import AddIcon from '@mui/icons-material/Add'

interface Props {
    open: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

const defaultFormData = {
    type: 'expense',
    amount: '',
    category: '',
    categoryIcon: null as JSX.Element | null,
    date: new Date().toISOString().split('T')[0],
    tag: '',
    description: '',
    images: [] as File[],
}

const defaultCategories = [
    { name: 'Food', icon: <RestaurantIcon fontSize="large" /> },
    { name: 'Transport', icon: <DirectionsCarIcon fontSize="large" /> },
    { name: 'Health', icon: <MedicalServicesIcon fontSize="large" /> },
    { name: 'Entertainment', icon: <TheatersIcon fontSize="large" /> },
    { name: 'Shopping', icon: <ShoppingBagIcon fontSize="large" /> },
]

export default function AdvancedTransactionModal({
    open,
    onClose,
    onSubmit,
}: Props) {
    const [formData, setFormData] = useState(defaultFormData)
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<{
        name: string
        icon: JSX.Element
    } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleTypeChange = (_: any, newType: string) => {
        if (newType) setFormData({ ...formData, type: newType })
    }

    const handleCategoryClick = (name: string, icon: JSX.Element) => {
        setFormData((prev) => ({
            ...prev,
            category: name,
            categoryIcon: icon,
        }))
        setSelectedCategory({ name, icon })
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && formData.images.length < 3) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, file],
            }))
        }
    }

    const handleSubmit = async () => {
        const { amount, category, date, type, description } = formData

        // Ensure amount is a valid positive number
        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Amount must be a positive number.')
            return
        }

        const token = localStorage.getItem('token')
        if (!token) {
            alert('No token found')
            return
        }

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_URL}/transactions`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: parsedAmount, // Send the parsed amount
                        category,
                        date,
                        type,
                        description,
                    }),
                }
            )

            const data = await res.json()

            if (res.ok) {
                alert('Transaction created')
                onSubmit(data.transaction) // Pass the new transaction to the parent component
                setFormData(defaultFormData) // Reset the form
                onClose() // Close the modal
            } else {
                alert(data.message || 'Failed to create transaction')
            }
        } catch (error) {
            console.error('Error creating transaction:', error)
            alert('An error occurred while creating the transaction.')
        }
    }

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        width: '90%',
                        maxWidth: 480,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        p: 3,
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
                        Add Transaction
                    </Typography>

                    <ToggleButtonGroup
                        fullWidth
                        value={formData.type}
                        exclusive
                        onChange={handleTypeChange}
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="expense">Expense</ToggleButton>
                        <ToggleButton value="income">Income</ToggleButton>
                    </ToggleButtonGroup>

                    <Button
                        startIcon={<WalletIcon />}
                        fullWidth
                        disabled
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        Account (placeholder)
                    </Button>

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Category
                    </Typography>

                    {selectedCategory &&
                        !defaultCategories.some(
                            (cat) => cat.name === selectedCategory.name
                        ) && (
                            <Box mb={2}>
                                <Typography variant="subtitle2">
                                    Selected Category
                                </Typography>
                                <Button
                                    fullWidth
                                    sx={{
                                        justifyContent: 'flex-start',
                                        textTransform: 'none',
                                        gap: 1,
                                        marginTop: 2,
                                        bgcolor: '#e0e0e0',
                                        '&:hover': {
                                            bgcolor: '#d5d5d5',
                                        },
                                    }}
                                    startIcon={
                                        <Avatar>{selectedCategory.icon}</Avatar>
                                    }
                                    onClick={() => setCategoryDialogOpen(true)}
                                >
                                    {selectedCategory.name}
                                </Button>
                            </Box>
                        )}

                    <Grid container spacing={2}>
                        {defaultCategories.map((cat) => (
                            <Grid item xs={4} key={cat.name}>
                                <Button
                                    onClick={() =>
                                        handleCategoryClick(cat.name, cat.icon)
                                    }
                                    fullWidth
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        py: 2,
                                        border: 'none',
                                        boxShadow: 'none',
                                        bgcolor:
                                            formData.category === cat.name
                                                ? 'action.selected'
                                                : 'transparent',
                                        '&:hover': {
                                            bgcolor: '#f0f0f0',
                                        },
                                    }}
                                >
                                    <Avatar sx={{ mb: 1 }}>{cat.icon}</Avatar>
                                    <Typography variant="caption">
                                        {cat.name}
                                    </Typography>
                                </Button>
                            </Grid>
                        ))}

                        <Grid item xs={4}>
                            <Button
                                fullWidth
                                onClick={() => setCategoryDialogOpen(true)}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    py: 2,
                                    border: 'none',
                                    boxShadow: 'none',
                                    bgcolor: categoryDialogOpen
                                        ? '#e0e0e0'
                                        : 'transparent',
                                    '&:hover': {
                                        bgcolor: '#f0f0f0',
                                    },
                                }}
                            >
                                <Avatar sx={{ mb: 1 }}>
                                    <AddIcon />
                                </Avatar>
                                <Typography variant="caption">More</Typography>
                            </Button>
                        </Grid>
                    </Grid>

                    <TextField
                        label="Amount"
                        name="amount"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={formData.amount}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        margin="normal"
                        name="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.date}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Tag"
                        fullWidth
                        name="tag"
                        value={formData.tag}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <TextField
                        label="Comment"
                        name="description"
                        fullWidth
                        multiline
                        rows={2}
                        margin="normal"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <Box display="flex" gap={2} mt={2}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Button
                                key={i}
                                variant="outlined"
                                component="label"
                                sx={{ flex: 1, aspectRatio: '1 / 1' }}
                            >
                                <AddPhotoAlternateIcon />
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                            </Button>
                        ))}
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ mt: 3, borderRadius: 999 }}
                        onClick={handleSubmit}
                    >
                        Add
                    </Button>
                </Box>
            </Modal>

            <CategorySelectorDialog
                open={categoryDialogOpen}
                selectedCategory={selectedCategory}
                onClose={() => setCategoryDialogOpen(false)}
                onSelect={(category) => {
                    handleCategoryClick(category.name, category.icon)
                    setCategoryDialogOpen(false)
                }}
            />
        </>
    )
}
