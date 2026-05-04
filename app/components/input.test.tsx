import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import InputField from './input'

describe('InputField', () => {
    test('renders with placeholder', () => {
        render(
            <InputField
                input=""
                setInput={() => {}}
                placeholder="Enter name"
                className="input_left"
            />
        )
        expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument()
    })

    test('displays the current input value', () => {
        render(
            <InputField
                input="hello"
                setInput={() => {}}
                placeholder="Enter name"
                className="input_left"
            />
        )
        expect(screen.getByDisplayValue('hello')).toBeInTheDocument()
    })

    test('calls setInput with typed value on change', () => {
        const setInput = jest.fn()
        render(
            <InputField
                input=""
                setInput={setInput}
                placeholder="Enter name"
                className="input_left"
            />
        )
        fireEvent.change(screen.getByPlaceholderText('Enter name'), {
            target: { value: 'new value' },
        })
        expect(setInput).toHaveBeenCalledWith('new value')
    })
})
