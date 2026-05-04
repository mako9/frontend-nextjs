import React from 'react'
import { render, screen } from '@testing-library/react'
import Contact, { getStaticProps } from '../../pages/contact'

describe('Contact page — getStaticProps', () => {
    test('returns i18n props', async () => {
        const result = await getStaticProps({ locale: 'en' } as any)
        expect('props' in result).toBe(true)
    })
})

describe('Contact page — component', () => {
    test('renders Contact Page heading', () => {
        render(<Contact />)
        expect(screen.getByText('Contact Page')).toBeInTheDocument()
    })
})
