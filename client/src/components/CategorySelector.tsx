import React, { useState, useEffect } from 'react'
import { Autocomplete, TextField, Button, Box, Typography } from '@mui/material'

interface CategorySelectorProps {
    value: string
    onChange: (value: string) => void
}

const defaultCategories = [
    'Food',
    'Transport',
    'Health',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Salary',
    'Investment',
    'Gift',
    'Other',
]

export default function CategorySelector({
    value,
    onChange,
}: CategorySelectorProps) {
    const [categories, setCategories] = useState<string[]>([])
    const [inputValue, setInputValue] = useState('')
    const [showSave, setShowSave] = useState(false)

    useEffect(() => {
        const saved = JSON.parse(
            localStorage.getItem('customCategories') || '[]'
        )
        setCategories([...defaultCategories, ...saved])
    }, [])

    useEffect(() => {
        setShowSave(
            inputValue.trim().length > 0 &&
                !categories.includes(inputValue.trim())
        )
    }, [inputValue, categories])

    const handleSaveCategory = () => {
        const trimmed = inputValue.trim()
        if (!trimmed || categories.includes(trimmed)) return

        const updated = [...categories, trimmed]
        setCategories(updated)
        localStorage.setItem(
            'customCategories',
            JSON.stringify(
                updated.filter((cat) => !defaultCategories.includes(cat))
            )
        )
        setShowSave(false)
    }

    return (
        <Box>
            <Autocomplete
                freeSolo
                options={categories}
                value={value}
                inputValue={inputValue}
                onInputChange={(_, newInput) => setInputValue(newInput)}
                onChange={(_, newValue) => onChange(newValue || '')}
                renderInput={(params) => (
                    <TextField {...params} label="Category" fullWidth />
                )}
            />

            {showSave && (
                <Box mt={1} display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" color="text.secondary">
                        Save "{inputValue}" to your categories?
                    </Typography>
                    <Button size="small" onClick={handleSaveCategory}>
                        Save
                    </Button>
                </Box>
            )}
        </Box>
    )
}
