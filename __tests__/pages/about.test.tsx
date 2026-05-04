import React from 'react'
import { render, screen } from '@testing-library/react'
import About, { getStaticProps } from '../../pages/about'

describe('About page — getStaticProps', () => {
    test('returns i18n props', async () => {
        const result = await getStaticProps({ locale: 'en' } as any)
        expect('props' in result).toBe(true)
    })
})

describe('About page — component', () => {
    test('renders About Page heading', () => {
        render(<About />)
        expect(screen.getByText('About Page')).toBeInTheDocument()
    })
})
