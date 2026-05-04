import React from 'react'
import { render, screen } from '@testing-library/react'
import NavItem from './navItem'

describe('NavItem', () => {
    test('renders the link text', () => {
        render(<NavItem text="Home" href="/" active={false} />)
        expect(screen.getByText('Home')).toBeInTheDocument()
    })

    test('links to the correct href', () => {
        render(<NavItem text="About" href="/about" active={false} />)
        expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
            'href',
            '/about'
        )
    })
})
