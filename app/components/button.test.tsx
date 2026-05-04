import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './button'

describe('Button', () => {
    test('renders the title', () => {
        render(<Button title="Click me" onClick={() => {}} />)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    test('calls onClick when clicked', () => {
        const onClick = jest.fn()
        render(<Button title="Click me" onClick={onClick} />)
        fireEvent.click(screen.getByText('Click me'))
        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('is disabled when isDisabled is true', () => {
        const onClick = jest.fn()
        render(<Button title="Click me" onClick={onClick} isDisabled={true} />)
        const button = screen.getByText('Click me')
        expect(button).toBeDisabled()
        fireEvent.click(button)
        expect(onClick).not.toHaveBeenCalled()
    })

    test('renders as a button element with optional type', () => {
        render(<Button title="Submit" onClick={() => {}} type="submit" />)
        expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
            'type',
            'submit'
        )
    })
})
