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
