import React from 'react'
import { render, screen } from '@testing-library/react'
import MyArea, { getServerSideProps } from '../../pages/my-area'
import { StateProvider } from '../../app/components/context'

jest.mock('app/lib/communities', () => ({
    getOwnedCommunities: jest.fn(),
}))
jest.mock('app/lib/items', () => ({
    getOwnedItems: jest.fn(),
}))
jest.mock('app/utils/session', () => ({
    getServerSideSession: jest.fn().mockResolvedValue({ accessToken: 'token' }),
}))
jest.mock('react-table', () => ({
    useTable: ({ columns, data }: { columns: any[]; data: any[] }) => ({
        getTableProps: () => ({}),
        getTableBodyProps: () => ({}),
        headerGroups: [{
            getHeaderGroupProps: () => ({}),
            headers: columns.map((col) => ({
                getHeaderProps: () => ({}),
                render: (t: string) => t === 'Header' ? col.Header : null,
                className: col.className,
            })),
        }],
        rows: data.map((row, index) => ({
            getRowProps: () => ({}),
            index,
            cells: columns.map((col) => ({
                getCellProps: () => ({}),
                column: { linkParams: col.linkParams },
                render: (t: string) => t === 'Cell' ? row[col.accessor] : null,
            })),
            original: row,
        })),
        prepareRow: jest.fn(),
    }),
}))

const { getOwnedCommunities } = require('app/lib/communities')
const { getOwnedItems } = require('app/lib/items')

const mockCommunitiesPage = {
    content: [{ uuid: 'com-1', name: 'My Community', communityName: '' }],
    isFirstPage: true, isLastPage: true, pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1,
}
const mockItemsPage = {
    content: [{ uuid: 'item-1', name: 'My Drill', communityName: 'My Community' }],
    isFirstPage: true, isLastPage: true, pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1,
}

describe('MyArea page — getServerSideProps', () => {
    beforeEach(() => {
        getOwnedCommunities.mockResolvedValue(mockCommunitiesPage)
        getOwnedItems.mockResolvedValue(mockItemsPage)
    })

    test('returns owned communities and items as props', async () => {
        const context = { req: {}, res: {}, locale: 'en' }
        const result = await getServerSideProps(context as any)
        if ('props' in result) {
            expect(result.props.ownedCommunitiesData).toEqual(mockCommunitiesPage.content)
            expect(result.props.ownedItemsData).toEqual(mockItemsPage.content)
        }
    })
})

describe('MyArea page — component', () => {
    test('renders toggle button', () => {
        render(
            <StateProvider>
                <MyArea ownedCommunitiesData={[]} ownedItemsData={[]} />
            </StateProvider>
        )
        expect(screen.getByText('myArea.communities')).toBeInTheDocument()
        expect(screen.getByText('myArea.items')).toBeInTheDocument()
    })

    test('renders create community button by default', () => {
        render(
            <StateProvider>
                <MyArea ownedCommunitiesData={[]} ownedItemsData={[]} />
            </StateProvider>
        )
        expect(screen.getByRole('button', { name: 'myArea.createCommunity' })).toBeInTheDocument()
    })

    test('has auth marker', () => {
        expect((MyArea as any).auth).toBe(true)
    })
})
