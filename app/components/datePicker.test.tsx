import React from 'react'
import { render, screen } from '@testing-library/react'
import CustomDatePicker from './datePicker'

describe('CustomDatePicker', () => {
    test('renders without crashing', () => {
        const date = new Date('2026-06-01')
        render(
            <CustomDatePicker selectedDate={date} setSelectedDate={() => {}} />
        )
        // DatePicker renders an input
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
})
