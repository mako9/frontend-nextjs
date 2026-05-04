import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ToggleButton from './toggleButton'

describe('ToggleButton', () => {
    test('renders both option titles', () => {
        render(
            <ToggleButton
                titleOne="Communities"
                titleTwo="Items"
                selectedIndex={0}
                setSelectedIndex={() => {}}
            />
        )
        expect(screen.getByText('Communities')).toBeInTheDocument()
        expect(screen.getByText('Items')).toBeInTheDocument()
    })

    test('calls setSelectedIndex(0) when first button clicked', () => {
        const setSelectedIndex = jest.fn()
        render(
            <ToggleButton
                titleOne="Communities"
                titleTwo="Items"
                selectedIndex={1}
                setSelectedIndex={setSelectedIndex}
            />
        )
        fireEvent.click(screen.getByText('Communities'))
        expect(setSelectedIndex).toHaveBeenCalledWith(0)
    })

    test('calls setSelectedIndex(1) when second button clicked', () => {
        const setSelectedIndex = jest.fn()
        render(
            <ToggleButton
                titleOne="Communities"
                titleTwo="Items"
                selectedIndex={0}
                setSelectedIndex={setSelectedIndex}
            />
        )
        fireEvent.click(screen.getByText('Items'))
        expect(setSelectedIndex).toHaveBeenCalledWith(1)
    })
})
