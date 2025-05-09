import React, { useState, useEffect } from 'react'
import {
    Modal,
    Box,
    Typography,
    Grid,
    Avatar,
    Button,
    TextField,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CategoryManagerModal from './CategoryManagerModal'

import RestaurantIcon from '@mui/icons-material/Restaurant'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import TheatersIcon from '@mui/icons-material/Theaters'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import SavingsIcon from '@mui/icons-material/Savings'
import RedeemIcon from '@mui/icons-material/Redeem'
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'
import OtherHousesIcon from '@mui/icons-material/OtherHouses'

const defaultCategories = [
    { name: 'Food', icon: <RestaurantIcon /> },
    { name: 'Transport', icon: <DirectionsCarIcon /> },
    { name: 'Health', icon: <MedicalServicesIcon /> },
    { name: 'Entertainment', icon: <TheatersIcon /> },
    { name: 'Shopping', icon: <ShoppingBagIcon /> },
    { name: 'Salary', icon: <AttachMoneyIcon /> },
    { name: 'Investment', icon: <SavingsIcon /> },
    { name: 'Gift', icon: <RedeemIcon /> },
    { name: 'Ideas', icon: <EmojiObjectsIcon /> },
    { name: 'Other', icon: <OtherHousesIcon /> },
]

interface Props {
    open: boolean
    selectedCategory: { name: string; icon: JSX.Element } | null
    onClose: () => void
    onSelect: (category: { name: string; icon: JSX.Element }) => void
}

export default function CategorySelectorDialog({
    open,
    selectedCategory,
    onClose,
    onSelect,
}: Props) {
    const [showCreate, setShowCreate] = useState(false)
    const [categories, setCategories] = useState(defaultCategories)
    const [search, setSearch] = useState('')

    useEffect(() => {
        // Ensure selected custom category appears in list
        if (
            selectedCategory &&
            !categories.some((cat) => cat.name === selectedCategory.name)
        ) {
            setCategories((prev) => [...prev, selectedCategory])
        }
    }, [selectedCategory])

    const handleSaveNewCategory = (category: {
        name: string
        icon: JSX.Element
    }) => {
        setCategories((prev) => [...prev, category])
        onSelect(category)
    }

    const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    )

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
                        maxWidth: 500,
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        p: 4,
                        borderRadius: 3,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Select Category
                    </Typography>

                    <TextField
                        placeholder="Search categories..."
                        fullWidth
                        variant="outlined"
                        sx={{ mb: 2 }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Grid container spacing={2}>
                        {filtered.map((cat) => (
                            <Grid item xs={4} key={cat.name}>
                                <Button
                                    onClick={() => {
                                        onSelect(cat)
                                        onClose()
                                    }}
                                    variant={
                                        selectedCategory?.name === cat.name
                                            ? 'contained'
                                            : 'text'
                                    }
                                    fullWidth
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        py: 2,
                                        height: '100%',
                                        textTransform: 'none',
                                        border: 'none',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
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
                                onClick={() => setShowCreate(true)}
                                fullWidth
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    py: 2,
                                    height: '100%',
                                    textTransform: 'none',
                                    border: 'none',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            >
                                <Avatar sx={{ mb: 1 }}>
                                    <AddCircleOutlineIcon />
                                </Avatar>
                                <Typography variant="caption">
                                    Add New
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            <CategoryManagerModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onSave={handleSaveNewCategory}
            />
        </>
    )
}
