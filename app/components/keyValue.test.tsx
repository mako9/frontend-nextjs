import React from 'react'
import { render, screen } from '@testing-library/react'
import KeyValue from './keyValue'

describe('KeyValue', () => {
    test('renders name and string value', () => {
        render(<KeyValue name="Street" value="Main St" />)
        expect(screen.getByText('Street:')).toBeInTheDocument()
        expect(screen.getByText('Main St')).toBeInTheDocument()
    })

    test('renders a ReactNode as value', () => {
        render(<KeyValue name="Label" value={<span data-testid="node">Node</span>} />)
        expect(screen.getByTestId('node')).toBeInTheDocument()
    })
})
