import React from 'react'
import { render, screen } from '@testing-library/react'
import NotificationsPage, { getServerSideProps } from '../../pages/notifications'

jest.mock('next-auth/react', () => ({
    ...jest.requireActual('next-auth/react'),
    getSession: jest.fn(),
    useSession: jest.fn(() => ({ data: { accessToken: 'mock-token' }, status: 'authenticated' })),
}))

jest.mock('app/lib/notifications', () => ({
    getNotifications: jest.fn(),
    markAllRead: jest.fn().mockResolvedValue(undefined),
    getUnreadCount: jest.fn().mockResolvedValue(0),
}))

const { getSession } = require('next-auth/react')
const { getNotifications, markAllRead } = require('app/lib/notifications')

const mockNotification = {
    uuid: 'n-1',
    type: 'BOOKING_CONFIRMED' as const,
    bookingUuid: 'b-1',
    read: false,
    createdAt: new Date('2025-03-01T10:00:00Z').toISOString(),
}

const Page = NotificationsPage as React.ComponentType<any>

describe('Notifications page — getServerSideProps', () => {
    test('fetches notifications and returns as props', async () => {
        const mockSession = { accessToken: 'token' }
        getSession.mockResolvedValue(mockSession)
        getNotifications.mockResolvedValue({ content: [mockNotification] })
        markAllRead.mockResolvedValue(undefined)
        const context = { req: {}, res: {}, locale: 'en', params: {} }
        const result = await getServerSideProps(context as any)
        expect('props' in result).toBe(true)
        if ('props' in result) {
            expect(result.props.notifications).toEqual([mockNotification])
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

describe('Notifications page — component', () => {
    test('renders page title', () => {
        render(<Page notifications={[]} />)
        expect(screen.getByText('notifications.title')).toBeInTheDocument()
    })

    test('renders empty state when no notifications', () => {
        render(<Page notifications={[]} />)
        expect(screen.getByText('notifications.empty')).toBeInTheDocument()
    })

    test('renders notification items', () => {
        render(<Page notifications={[mockNotification]} />)
        expect(screen.getByText(/notification\.type\.BOOKING_CONFIRMED/)).toBeInTheDocument()
    })
})
