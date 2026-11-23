import React from 'react'
import { render, screen } from '@testing-library/react'
import BookingDetailPage, { getServerSideProps } from '../../../pages/bookings/[uuid]'

jest.mock('next-auth/react', () => ({
    ...jest.requireActual('next-auth/react'),
    getSession: jest.fn(),
    useSession: jest.fn(() => ({ data: { accessToken: 'mock-token' }, status: 'authenticated' })),
}))

jest.mock('app/lib/bookings', () => ({
    getBooking: jest.fn(),
    approveBooking: jest.fn(),
    declineBooking: jest.fn(),
    cancelBooking: jest.fn(),
    returnBooking: jest.fn(),
}))

const { getSession } = require('next-auth/react')
const { getBooking } = require('app/lib/bookings')

const futureStart = new Date(Date.now() + 86400000 * 5).toISOString()
const futureEnd = new Date(Date.now() + 86400000 * 6).toISOString()
const pastStart = new Date(Date.now() - 86400000 * 5).toISOString()
const pastEnd = new Date(Date.now() - 86400000 * 4).toISOString()

const mockBooking = {
    uuid: 'b-1',
    itemUuid: 'i-1',
    userUuid: 'u-1',
    startAt: futureStart,
    endAt: futureEnd,
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED' as const,
    isItemOwner: false,
}

const Page = BookingDetailPage as React.ComponentType<any>

describe('Booking detail page — getServerSideProps', () => {
    test('fetches booking and returns as prop', async () => {
        const mockSession = { accessToken: 'token' }
        getSession.mockResolvedValue(mockSession)
        getBooking.mockResolvedValue(mockBooking)
        const context = { req: {}, res: {}, locale: 'en', params: { uuid: 'b-1' } }
        const result = await getServerSideProps(context as any)
        expect('props' in result).toBe(true)
        if ('props' in result) {
            expect(result.props.booking).toEqual(mockBooking)
        }
    })

    test('redirects to login when no session', async () => {
        getSession.mockResolvedValue(null)
        const context = { req: {}, res: {}, locale: 'en', params: { uuid: 'b-1' } }
        const result = await getServerSideProps(context as any)
        expect('redirect' in result).toBe(true)
        if ('redirect' in result) {
            expect(result.redirect.destination).toBe('/login')
        }
    })
})

describe('Booking detail page — component', () => {
    test('shows not found when booking is null', () => {
        render(<Page booking={null} />)
        expect(screen.getByText('bookings.notFound')).toBeInTheDocument()
    })

    test('renders status and dates', () => {
        render(<Page booking={mockBooking} />)
        expect(screen.getByText(/booking\.status\.label/)).toBeInTheDocument()
        expect(screen.getByText(/booking\.status\.confirmed/)).toBeInTheDocument()
    })

    test('shows cancel button for cancellable booking', () => {
        render(<Page booking={mockBooking} />)
        expect(screen.getByRole('button', { name: 'booking.cancel' })).toBeInTheDocument()
    })

    test('hides cancel button for past booking', () => {
        const pastBooking = { ...mockBooking, startAt: pastStart, endAt: pastEnd }
        render(<Page booking={pastBooking} />)
        expect(screen.queryByRole('button', { name: 'booking.cancel' })).not.toBeInTheDocument()
    })
})

describe('Booking detail page — who may act', () => {
    const pendingOwner = { ...mockBooking, status: 'PENDING' as const, isItemOwner: true }
    const pendingRequester = { ...mockBooking, status: 'PENDING' as const, isItemOwner: false }

    test('the owner of a pending booking sees approve and decline', () => {
        render(<Page booking={pendingOwner} />)
        expect(screen.getByRole('button', { name: 'booking.approve' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'booking.decline' })).toBeInTheDocument()
    })

    test('the requester of a pending booking sees neither approve nor decline', () => {
        render(<Page booking={pendingRequester} />)
        expect(screen.queryByRole('button', { name: 'booking.approve' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'booking.decline' })).not.toBeInTheDocument()
    })

    // "returned" means the item is back with its owner. Before the rental has started there is nothing to
    // hand back, and the server refuses it - the action for an unwanted future booking is cancel.
    test('a confirmed booking whose rental is under way offers marking it returned', () => {
        render(<Page booking={{ ...mockBooking, startAt: pastStart, endAt: futureEnd }} />)
        expect(screen.getByRole('button', { name: 'booking.return' })).toBeInTheDocument()
    })

    test('a confirmed booking that has not started offers cancelling, not returning', () => {
        render(<Page booking={mockBooking} />)
        expect(screen.queryByRole('button', { name: 'booking.return' })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'booking.cancel' })).toBeInTheDocument()
    })

    test('a returned booking offers no action at all', () => {
        render(<Page booking={{ ...mockBooking, status: 'RETURNED' as const, isItemOwner: true }} />)
        expect(screen.queryByRole('button', { name: 'booking.approve' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'booking.decline' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'booking.cancel' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'booking.return' })).not.toBeInTheDocument()
        expect(screen.getByText(/booking\.status\.returned/)).toBeInTheDocument()
    })
})
