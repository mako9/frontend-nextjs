import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { StateProvider } from '../context'
import ownedCommunity from './ownedCommunity'

jest.mock('../../lib/communities', () => ({
    editCommunity: jest.fn().mockResolvedValue({}),
    deleteCommunity: jest.fn().mockResolvedValue({}),
    approveMemberRequests: jest.fn().mockResolvedValue({}),
    declineMemberRequests: jest.fn().mockResolvedValue({}),
}))

jest.mock('react-table', () => ({
    useTable: ({ columns, data }: { columns: any[]; data: any[] }) => ({
        getTableProps: () => ({}),
        getTableBodyProps: () => ({}),
        headerGroups: [
            {
                getHeaderGroupProps: () => ({}),
                headers: columns.map((col) => ({
                    getHeaderProps: () => ({}),
                    render: (type: string) => type === 'Header' ? col.Header : null,
                    className: col.className,
                })),
            },
        ],
        rows: data.map((row, index) => ({
            getRowProps: () => ({}),
            index,
            cells: columns.map((col) => ({
                getCellProps: () => ({}),
                column: { linkParams: undefined },
                render: (type: string) => type === 'Cell' ? row[col.accessor] : null,
            })),
            original: row,
        })),
        prepareRow: jest.fn(),
    }),
}))

const t = (key: string) => key
const mockSession = { accessToken: 'token' }
const mockCommunityData = {
    uuid: 'com-1',
    name: 'Test Community',
    street: 'Main St',
    houseNumber: '1',
    postalCode: '12345',
    city: 'Munich',
    radius: 500,
    latitude: 48.0,
    longitude: 11.0,
    canBeJoined: true,
}
const mockMembers = { content: [{ uuid: 'u-1', firstName: 'Jane', lastName: 'Doe' }] }
const mockRequestingMember = { content: [] }

const Wrapper = () =>
    ownedCommunity(mockSession, mockCommunityData, mockMembers, mockRequestingMember, t)

describe('ownedCommunity', () => {
    test('renders community name', () => {
        render(
            <StateProvider>
                <Wrapper />
            </StateProvider>
        )
        expect(screen.getAllByText('Test Community').length).toBeGreaterThan(0)
    })

    test('renders member list', () => {
        render(
            <StateProvider>
                <Wrapper />
            </StateProvider>
        )
        expect(screen.getByText('Jane')).toBeInTheDocument()
    })

    test('approve and decline buttons are disabled when no requests exist', () => {
        render(
            <StateProvider>
                <Wrapper />
            </StateProvider>
        )
        expect(
            screen.getByRole('button', { name: 'community.approveRequests' })
        ).toBeDisabled()
        expect(
            screen.getByRole('button', { name: 'community.declineRequests' })
        ).toBeDisabled()
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
})
