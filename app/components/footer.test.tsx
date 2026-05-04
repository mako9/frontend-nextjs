import React from 'react'
import { render } from '@testing-library/react'
import Footer from './footer'

describe('Footer', () => {
    test('renders without crashing', () => {
        const { container } = render(<Footer />)
        expect(container.firstChild).toBeInTheDocument()
    })

    test('renders copyright text', () => {
        const { getByText } = render(<Footer />)
        expect(getByText(/ComShare/)).toBeInTheDocument()
    })
})
