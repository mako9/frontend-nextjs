import React from 'react'
import { render, screen } from '@testing-library/react'
import BookingsPage, { getServerSideProps } from '../../../pages/bookings/index'

jest.mock('next-auth/react', () => ({
    ...jest.requireActual('next-auth/react'),
    getSession: jest.fn(),
    useSession: jest.fn(() => ({ data: { accessToken: 'mock-token' }, status: 'authenticated' })),
}))

jest.mock('app/lib/bookings', () => ({
    getMyBookings: jest.fn(),
}))

const { getSession } = require('next-auth/react')
const { getMyBookings } = require('app/lib/bookings')

const mockBooking = {
    uuid: 'b-1',
    itemUuid: 'i-1',
    userUuid: 'u-1',
    startAt: new Date('2025-03-01').toISOString(),
    endAt: new Date('2025-03-05').toISOString(),
    createdAt: new Date('2025-02-01').toISOString(),
    status: 'PENDING' as const,
}

const Page = BookingsPage as React.ComponentType<any>

describe('Bookings index page — getServerSideProps', () => {
    test('fetches my bookings and returns as props', async () => {
        const mockSession = { accessToken: 'token' }
        getSession.mockResolvedValue(mockSession)
        getMyBookings.mockResolvedValue({ content: [mockBooking] })
        const context = { req: {}, res: {}, locale: 'en', params: {} }
        const result = await getServerSideProps(context as any)
        expect('props' in result).toBe(true)
        if ('props' in result) {
            expect(result.props.myBookings).toEqual([mockBooking])
        }
    })

    test('redirects to login when no session', async () => {
        getSession.mockResolvedValue(null)
        const context = { req: {}, res: {}, locale: 'en', params: {} }
        const result = await getServerSideProps(context as any)
        expect('redirect' in result).toBe(true)
        if ('redirect' in result) {
            expect(result.redirect.destination).toBe('/login')
        }
    })
})

describe('Bookings index page — component', () => {
    test('renders page title', () => {
        render(<Page myBookings={[]} />)
        expect(screen.getByText('bookings.title')).toBeInTheDocument()
    })

    test('renders empty state message when no bookings', () => {
        render(<Page myBookings={[]} />)
        expect(screen.getByText('bookings.noBookings')).toBeInTheDocument()
    })

    test('renders booking items with status and dates', () => {
        render(<Page myBookings={[mockBooking]} />)
        expect(screen.getByText(/booking\.status\.pending/)).toBeInTheDocument()
    })
})
