import React from 'react'
import { render, screen } from '@testing-library/react'
import createItemPage, { getServerSideProps } from '../../../pages/items/create'
import { StateProvider } from '../../../app/components/context'

jest.mock('app/lib/communities', () => ({
    getMyCommunities: jest.fn(),
}))
jest.mock('app/lib/items', () => ({
    createItem: jest.fn().mockResolvedValue({ uuid: 'new-item' }),
    uploadItemImage: jest.fn().mockResolvedValue(undefined),
}))
jest.mock('app/utils/session', () => ({
    getServerSideSession: jest.fn().mockResolvedValue({ accessToken: 'token' }),
}))

const { getMyCommunities } = require('app/lib/communities')

const mockCommunitiesPage = {
    content: [{ uuid: 'com-1', name: 'Test Community' }],
    isFirstPage: true, isLastPage: true, pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1,
}

const Page = createItemPage as React.ComponentType<any>

describe('Create Item page — getServerSideProps', () => {
    test('fetches communities and returns as props', async () => {
        getMyCommunities.mockResolvedValue(mockCommunitiesPage)
        const context = { req: {}, res: {}, locale: 'en' }
        const result = await getServerSideProps(context as any)
        if ('props' in result) {
            expect(result.props.myCommunities).toEqual(mockCommunitiesPage)
        }
    })
})

describe('Create Item page — component', () => {
    test('renders name input field', () => {
        render(
            <StateProvider>
                <Page myCommunities={mockCommunitiesPage} />
            </StateProvider>
        )
        expect(screen.getByPlaceholderText('name')).toBeInTheDocument()
    })

    test('renders save button', () => {
        render(
            <StateProvider>
                <Page myCommunities={mockCommunitiesPage} />
            </StateProvider>
        )
        expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument()
    })

    test('has auth marker', () => {
        expect((createItemPage as any).auth).toBe(true)
    })
})
