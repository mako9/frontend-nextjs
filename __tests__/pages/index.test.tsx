import React from 'react'
import { render, screen } from '@testing-library/react'
import Home, { getServerSideProps } from '../../pages/index'
import { StateProvider } from '../../app/components/context'

jest.mock('app/lib/communities', () => ({
    getAllCommunities: jest.fn(),
}))
jest.mock('app/lib/items', () => ({
    getAllItemsOfMyCommunities: jest.fn(),
    getItemImage: jest.fn().mockResolvedValue(null),
}))
jest.mock('app/utils/session', () => ({
    getServerSideSession: jest.fn().mockResolvedValue({ accessToken: 'token' }),
}))

const { getAllCommunities } = require('app/lib/communities')
const { getAllItemsOfMyCommunities } = require('app/lib/items')

const mockCommunitiesPage = {
    content: [{ uuid: 'com-1', name: 'Green Neighborhood' }],
    isFirstPage: true, isLastPage: true, pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1,
}
const mockItemsPage = {
    content: [{ uuid: 'item-1', name: 'Drill', firstImageUuid: null }],
    isFirstPage: true, isLastPage: true, pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1,
}

describe('Home page — getServerSideProps', () => {
    beforeEach(() => {
        getAllCommunities.mockResolvedValue(mockCommunitiesPage)
        getAllItemsOfMyCommunities.mockResolvedValue(mockItemsPage)
    })

    test('calls getAllCommunities and getAllItemsOfMyCommunities and returns their content', async () => {
        const context = { req: {}, res: {}, locale: 'en' }
        const result = await getServerSideProps(context as any)
        expect('props' in result).toBe(true)
        if ('props' in result) {
            expect(result.props.allCommunitiesData).toEqual(mockCommunitiesPage.content)
            expect(result.props.allItemsData).toEqual(mockItemsPage.content)
        }
    })

    test('returns empty arrays when lib functions return null', async () => {
        getAllCommunities.mockResolvedValue(null)
        getAllItemsOfMyCommunities.mockResolvedValue(null)
        const context = { req: {}, res: {}, locale: 'en' }
        const result = await getServerSideProps(context as any)
        if ('props' in result) {
            expect(result.props.allCommunitiesData).toEqual([])
            expect(result.props.allItemsData).toEqual([])
        }
    })
})

describe('Home page — component', () => {
    test('renders community names', () => {
        render(
            <StateProvider>
                <Home
                    allCommunitiesData={[{ uuid: 'com-1', name: 'Green Neighborhood' }]}
                    allItemsData={[]}
                />
            </StateProvider>
        )
        expect(screen.getByText('Green Neighborhood')).toBeInTheDocument()
    })

    test('has auth marker', () => {
        expect((Home as any).auth).toBe(true)
    })
})
