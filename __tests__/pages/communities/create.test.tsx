import React from 'react'
import { render, screen } from '@testing-library/react'
import createCommunityPage, { getServerSideProps } from '../../../pages/communities/create'
import { StateProvider } from '../../../app/components/context'

jest.mock('app/lib/communities', () => ({
    createCommunity: jest.fn().mockResolvedValue({}),
}))

const Page = createCommunityPage as React.ComponentType<any>

describe('Create Community page — getServerSideProps', () => {
    test('returns i18n props', async () => {
        const result = await getServerSideProps({ locale: 'en' } as any)
        expect('props' in result).toBe(true)
    })
})

describe('Create Community page — component', () => {
    test('renders name input field', () => {
        render(
            <StateProvider>
                <Page />
            </StateProvider>
        )
        expect(screen.getByPlaceholderText('name')).toBeInTheDocument()
    })

    test('renders save button', () => {
        render(
            <StateProvider>
                <Page />
            </StateProvider>
        )
        expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument()
    })

    test('has auth marker', () => {
        expect((createCommunityPage as any).auth).toBe(true)
    })
})
