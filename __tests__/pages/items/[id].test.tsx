import React from 'react'
import { render, screen } from '@testing-library/react'
import Item, { getServerSideProps } from '../../../pages/items/[id]'
import { StateProvider } from '../../../app/components/context'

jest.mock('app/lib/items', () => ({
    getItem: jest.fn(),
    getItemImageUuids: jest.fn(),
}))
jest.mock('app/lib/communities', () => ({
    getMyCommunities: jest.fn(),
}))
jest.mock('app/utils/session', () => ({
    getServerSideSession: jest.fn().mockResolvedValue({ accessToken: 'token' }),
}))
jest.mock('app/components/subpages/ownedItem', () =>
    jest.fn(() => <div data-testid="owned-item">Owned Item View</div>)
)
jest.mock('app/components/subpages/foreignItem', () =>
    jest.fn(() => <div data-testid="foreign-item">Foreign Item View</div>)
)

const { getItem, getItemImageUuids } = require('app/lib/items')
const { getMyCommunities } = require('app/lib/communities')

const mockItem = {
    uuid: 'item-1', name: 'Drill', categories: ['TOOL'],
    street: 'Main St', houseNumber: '1', postalCode: '12345', city: 'Munich',
    communityUuid: 'com-1', userUuid: 'user-1', active: true,
    availability: [], availableUntil: null, description: 'desc',
    communityName: 'Test Community', firstImageUuid: null,
}
const mockCommunitiesPage = {
    content: [], isFirstPage: true, isLastPage: true, pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0,
}

describe('Item page — getServerSideProps', () => {
    beforeEach(() => {
        getItem.mockResolvedValue(mockItem)
        getItemImageUuids.mockResolvedValue([])
        getMyCommunities.mockResolvedValue(mockCommunitiesPage)
    })

    test('fetches item, image UUIDs, and communities and returns as props', async () => {
        const context = { req: {}, res: {}, params: { id: 'item-1' }, query: {}, locale: 'en' }
        const result = await getServerSideProps(context as any)
        if ('props' in result) {
            expect(result.props.itemData).toEqual(mockItem)
            expect(getItem).toHaveBeenCalledWith('item-1', expect.any(Object))
        }
    })
})

describe('Item page — component', () => {
    test('renders foreign item view when isOwned is false', () => {
        render(
            <StateProvider>
                <Item
                    itemData={mockItem}
                    itemImageData={[]}
                    myCommunities={mockCommunitiesPage}
                    isOwned="false"
                />
            </StateProvider>
        )
        expect(screen.getByTestId('foreign-item')).toBeInTheDocument()
    })

    test('renders owned item view when isOwned is true', () => {
        render(
            <StateProvider>
                <Item
                    itemData={mockItem}
                    itemImageData={[]}
                    myCommunities={mockCommunitiesPage}
                    isOwned="true"
                />
            </StateProvider>
        )
        expect(screen.getByTestId('owned-item')).toBeInTheDocument()
    })

    test('renders nothing when itemData is null', () => {
        const { container } = render(
            <StateProvider>
                <Item
                    itemData={null}
                    itemImageData={[]}
                    myCommunities={mockCommunitiesPage}
                    isOwned="false"
                />
            </StateProvider>
        )
        expect(container.firstChild).toBeNull()
    })
})
