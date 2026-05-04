import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Dropdown from './dropdown'

const options = [
    { id: 'A', label: 'Option A' },
    { id: 'B', label: 'Option B' },
    { id: 'C', label: 'Option C' },
]

describe('Dropdown', () => {
    test('renders placeholder when no option selected', () => {
        render(
            <Dropdown
                options={options}
                placeHolder="Please select"
                isMulti={false}
                isSearchable={false}
                onChange={() => {}}
                initialOption={[]}
            />
        )
        expect(screen.getByText('Please select')).toBeInTheDocument()
    })

    test('shows options when clicked', () => {
        render(
            <Dropdown
                options={options}
                placeHolder="Please select"
                isMulti={false}
                isSearchable={false}
                onChange={() => {}}
                initialOption={[]}
            />
        )
        fireEvent.click(screen.getByText('Please select'))
        expect(screen.getByText('Option A')).toBeInTheDocument()
        expect(screen.getByText('Option B')).toBeInTheDocument()
    })

    test('single select calls onChange with selected option', () => {
        const onChange = jest.fn()
        render(
            <Dropdown
                options={options}
                placeHolder="Please select"
                isMulti={false}
                isSearchable={false}
                onChange={onChange}
                initialOption={[]}
            />
        )
        fireEvent.click(screen.getByText('Please select'))
        fireEvent.click(screen.getByText('Option A'))
        expect(onChange).toHaveBeenCalledWith([{ id: 'A', label: 'Option A' }])
    })

    test('multi select calls onChange with accumulated options', () => {
        const onChange = jest.fn()
        render(
            <Dropdown
                options={options}
                placeHolder="Please select"
                isMulti={true}
                isSearchable={false}
                onChange={onChange}
                initialOption={[]}
            />
        )
        fireEvent.click(screen.getByText('Please select'))
        fireEvent.click(screen.getByText('Option A'))
        expect(onChange).toHaveBeenCalledWith([{ id: 'A', label: 'Option A' }])
    })

    test('shows initial options as selected', () => {
        render(
            <Dropdown
                options={options}
                placeHolder="Please select"
                isMulti={false}
                isSearchable={false}
                onChange={() => {}}
                initialOption={[{ id: 'B', label: 'Option B' }]}
            />
        )
        expect(screen.getByText('Option B')).toBeInTheDocument()
    })

    test('search filters visible options', () => {
        render(
            <Dropdown
                options={options}
                placeHolder="Please select"
                isMulti={false}
                isSearchable={true}
                onChange={() => {}}
                initialOption={[]}
            />
        )
        fireEvent.click(screen.getByText('Please select'))
        const searchInput = screen.getByRole('textbox')
        fireEvent.change(searchInput, { target: { value: 'Option A' } })
        expect(screen.getByText('Option A')).toBeInTheDocument()
        expect(screen.queryByText('Option B')).not.toBeInTheDocument()
    })
})
