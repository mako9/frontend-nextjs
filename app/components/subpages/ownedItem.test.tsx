import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { StateProvider } from '../context'
import ownedItem from './ownedItem'

jest.mock('../../lib/items', () => ({
    getItemImage: jest.fn().mockResolvedValue(new Blob(['img'])),
    editItem: jest.fn().mockResolvedValue({}),
    deleteItem: jest.fn().mockResolvedValue(undefined),
    uploadItemImage: jest.fn().mockResolvedValue(undefined),
    deleteItemImage: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('react-table', () => ({
    useTable: ({ columns, data }: { columns: any[]; data: any[] }) => ({
        getTableProps: () => ({}),
        getTableBodyProps: () => ({}),
        headerGroups: [],
        rows: [],
        prepareRow: jest.fn(),
    }),
}))

const t = (key: string) => key
const mockSession = { accessToken: 'token' }
const mockItemData = {
    uuid: 'item-1',
    name: 'Power Drill',
    categories: ['TOOL'],
    street: 'Main St',
    houseNumber: '1',
    postalCode: '12345',
    city: 'Munich',
    communityUuid: 'com-1',
    userUuid: 'user-1',
    active: true,
    availability: [],
    availableUntil: null,
    description: 'A powerful drill',
    communityName: 'Test Community',
    firstImageUuid: null,
}
const mockMyCommunities = [
    { uuid: 'com-1', name: 'Test Community' },
]

const Wrapper = () =>
    ownedItem(mockSession, mockItemData, [], mockMyCommunities, t)

describe('ownedItem', () => {
    test('renders item name', () => {
        render(
            <StateProvider>
                <Wrapper />
            </StateProvider>
        )
        expect(screen.getAllByText('Power Drill').length).toBeGreaterThan(0)
    })

    test('renders save and delete buttons', () => {
        render(
            <StateProvider>
                <Wrapper />
            </StateProvider>
        )
        expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument()
    })

    test('renders name and address input fields', () => {
        render(
            <StateProvider>
                <Wrapper />
            </StateProvider>
        )
        expect(screen.getByDisplayValue('Power Drill')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Munich')).toBeInTheDocument()
    })

    test('renders requiresApproval checkbox', () => {
        render(
            <StateProvider>
                <Wrapper />
            </StateProvider>
        )
        // The component renders two checkboxes: isActive (checked=true) and requiresApproval (checked=false)
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes.length).toBeGreaterThanOrEqual(2)
        const requiresApprovalCheckbox = checkboxes[1]
        expect(requiresApprovalCheckbox).toBeInTheDocument()
        expect(requiresApprovalCheckbox).not.toBeChecked()
    })
})
