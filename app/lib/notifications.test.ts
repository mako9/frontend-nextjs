import {
    getNotifications,
    getUnreadCount,
    markAllRead,
    markRead,
} from './notifications'

jest.mock('../utils/logger', () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}))

process.env.BACKEND_BASE_URL = 'http://test-api'

const mockSession = { accessToken: 'test-token' }

const mockNotification = {
    uuid: 'n-1',
    type: 'BOOKING_CONFIRMED',
    bookingUuid: 'b-1',
    read: false,
    createdAt: '2026-07-08T09:00:00Z',
}

const mockPage = {
    content: [mockNotification],
    isFirstPage: true,
    isLastPage: true,
    pageNumber: 0,
    pageSize: 20,
    totalElements: 1,
    totalPages: 1,
}

function mockFetchOk(data: any) {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => data,
        blob: async () => data,
    } as any)
}

function mockFetchError() {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'error' }),
    } as any)
}

afterEach(() => (global.fetch as jest.Mock).mockReset())

describe('getNotifications', () => {
    test('calls GET /user/notification/ and returns page data', async () => {
        mockFetchOk(mockPage)
        const result = await getNotifications(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/notification/'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getNotifications(mockSession)
        expect(result).toBeNull()
    })
})

describe('getUnreadCount', () => {
    test('calls GET /user/notification/unread-count and returns count', async () => {
        mockFetchOk({ count: 5 })
        const result = await getUnreadCount(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/notification/unread-count'),
            expect.any(Object)
        )
        expect(result).toBe(5)
    })

    test('returns 0 on error response', async () => {
        mockFetchError()
        const result = await getUnreadCount(mockSession)
        expect(result).toBe(0)
    })
})

describe('markAllRead', () => {
    test('calls PATCH /user/notification/read-all', async () => {
        mockFetchOk(null)
        await markAllRead(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/notification/read-all'),
            expect.objectContaining({ method: 'PATCH' })
        )
    })

    test('does not throw on error response', async () => {
        mockFetchError()
        await expect(markAllRead(mockSession)).resolves.toBeUndefined()
    })
})

describe('markRead', () => {
    test('calls PATCH /user/notification/:uuid/read', async () => {
        mockFetchOk(null)
        await markRead('n-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/notification/n-1/read'),
            expect.objectContaining({ method: 'PATCH' })
        )
    })

    test('does not throw on error response', async () => {
        mockFetchError()
        await expect(markRead('n-1', mockSession)).resolves.toBeUndefined()
    })
})
