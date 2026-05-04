import React from 'react'
import { render, screen } from '@testing-library/react'
import NavBar from './navBar'
import { StateProvider } from './context'

describe('NavBar', () => {
    test('renders the site title', () => {
        render(
            <StateProvider>
                <NavBar />
            </StateProvider>
        )
        expect(screen.getByText('ComShare')).toBeInTheDocument()
    })

    test('renders navigation links', () => {
        render(
            <StateProvider>
                <NavBar />
            </StateProvider>
        )
        expect(screen.getByText('navBar.home')).toBeInTheDocument()
        expect(screen.getByText('navBar.about')).toBeInTheDocument()
        expect(screen.getByText('navBar.contact')).toBeInTheDocument()
    })
})
