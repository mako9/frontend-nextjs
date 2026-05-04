import React from 'react'
import { render, screen } from '@testing-library/react'
import Settings, { getStaticProps } from '../../pages/settings'

describe('Settings page — getStaticProps', () => {
    test('returns i18n props', async () => {
        const result = await getStaticProps({ locale: 'en' } as any)
        expect('props' in result).toBe(true)
    })
})

describe('Settings page — component', () => {
    test('renders Settings heading', () => {
        render(<Settings />)
        expect(screen.getByText('Settings')).toBeInTheDocument()
    })
})
