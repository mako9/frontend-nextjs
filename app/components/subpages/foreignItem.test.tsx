import React from 'react'
import { render, screen } from '@testing-library/react'
import foreignItem from './foreignItem'

jest.mock('../../lib/items', () => ({
    getItemImage: jest.fn().mockResolvedValue(new Blob(['img'])),
    bookItem: jest.fn().mockResolvedValue(undefined),
}))

const t = (key: string) => key
const mockSession = { accessToken: 'token' }
const mockItemData = {
    uuid: 'item-1',
    name: 'Lawn Mower',
    categories: ['GARDENING'],
    street: 'Oak Ave',
    houseNumber: '3',
    postalCode: '80331',
    city: 'Munich',
    communityUuid: 'com-1',
    userUuid: 'user-2',
    active: true,
    availability: [],
    availableUntil: null,
    description: 'Great for the garden',
    communityName: 'Green Neighborhood',
    firstImageUuid: null,
}

const Wrapper = () => foreignItem(mockSession, mockItemData, [], t)

describe('foreignItem', () => {
    test('renders item name', () => {
        render(<Wrapper />)
        expect(screen.getByText('Lawn Mower')).toBeInTheDocument()
    })

    test('renders item description', () => {
        render(<Wrapper />)
        expect(screen.getByText('Great for the garden')).toBeInTheDocument()
    })

    test('renders category label', () => {
        render(<Wrapper />)
        expect(screen.getByText('item.category.gardening')).toBeInTheDocument()
    })

    test('renders request button', () => {
        render(<Wrapper />)
        expect(
            screen.getByRole('button', { name: 'item.requestItem' })
        ).toBeInTheDocument()
    })
})
