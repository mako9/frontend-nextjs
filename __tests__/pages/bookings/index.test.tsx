import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import BookingsPage, { getServerSideProps } from '../../../pages/bookings/index'

jest.mock('next-auth/react', () => ({
    ...jest.requireActual('next-auth/react'),
    getSession: jest.fn(),
    useSession: jest.fn(() => ({ data: { accessToken: 'mock-token' }, status: 'authenticated' })),
}))

jest.mock('app/lib/bookings', () => ({
    getMyBookings: jest.fn(),
    getReceivedBookings: jest.fn(),
}))

const { getSession } = require('next-auth/react')
const { getMyBookings, getReceivedBookings } = require('app/lib/bookings')

const mockBooking = {
    uuid: 'b-1',
    itemUuid: 'i-1',
    userUuid: 'u-1',
    startAt: new Date('2025-03-01').toISOString(),
    endAt: new Date('2025-03-05').toISOString(),
    createdAt: new Date('2025-02-01').toISOString(),
    status: 'PENDING' as const,
    isItemOwner: false,
}

const returnedBooking = { ...mockBooking, uuid: 'b-2', status: 'RETURNED' as const, isItemOwner: true }

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
            // Next's GetServerSidePropsResult allows props to be a promise, so the props object
            // itself has to be awaited before a field can be read off it
            const props = await result.props
            expect(props.myBookings).toEqual([mockBooking])
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

describe('Bookings index page — both sides of a booking', () => {
    test('getServerSideProps returns my requests and the requests for my items', async () => {
        getSession.mockResolvedValue({ accessToken: 'token' })
        getMyBookings.mockResolvedValue({ content: [mockBooking] })
        getReceivedBookings.mockResolvedValue({ content: [returnedBooking] })
        const context = { req: {}, res: {}, locale: 'en', params: {} }

        const result = await getServerSideProps(context as any)

        expect('props' in result).toBe(true)
        // `props` is typed as a union with a promise, so `in` does not narrow it; one cast here keeps
        // this test from adding to the pre-existing pile Phase 1 reduces to zero
        const props = (result as { props: Record<string, any> }).props

        expect(props.myBookings).toEqual([mockBooking])
        expect(props.receivedBookings).toEqual([returnedBooking])
    })

    test('a RETURNED booking is labelled Returned, and not left without a colour', () => {
        render(<Page myBookings={[returnedBooking]} receivedBookings={[]} />)
        expect(screen.getByText(/booking\.status\.returned/)).toBeInTheDocument()
        // jsdom resolves the named colour, so this asserts the mapping and, more importantly, that
        // RETURNED has a colour at all - before this it rendered with `color: undefined`
        expect(screen.getByText(/booking\.status\.returned/).closest('span')).toHaveStyle({ color: 'rgb(0, 0, 255)' })
    })

    test('the received tab lists the requests other neighbours made for my items', () => {
        render(<Page myBookings={[]} receivedBookings={[returnedBooking]} />)
        fireEvent.click(screen.getByText('bookings.received'))
        expect(screen.getAllByText(/booking\.status\.returned/).length).toBe(1)
    })

    test('each side says what it is, so an owner cannot mistake the two', () => {
        render(<Page myBookings={[mockBooking]} receivedBookings={[returnedBooking]} />)
        expect(screen.getByText('bookings.myRequests')).toBeInTheDocument()
        expect(screen.getByText('bookings.received')).toBeInTheDocument()
    })
})
