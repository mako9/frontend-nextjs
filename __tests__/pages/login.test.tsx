import React from 'react'
import { render, screen } from '@testing-library/react'
import Login, { getServerSideProps } from '../../pages/login'
import { StateProvider } from '../../app/components/context'

describe('Login page — getServerSideProps', () => {
    test('returns i18n props', async () => {
        const result = await getServerSideProps({ locale: 'en' } as any)
        expect('props' in result).toBe(true)
    })
})

describe('Login page — component', () => {
    test('renders sign-in button', () => {
        render(
            <StateProvider>
                <Login />
            </StateProvider>
        )
        expect(screen.getByRole('button', { name: 'login.goToSignup' })).toBeInTheDocument()
    })
})
