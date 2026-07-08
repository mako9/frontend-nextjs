import {
    getMyBookings,
    getBookingsForItem,
    getBooking,
    approveBooking,
    declineBooking,
    cancelBooking,
} from './bookings'

jest.mock('../utils/logger', () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}))

process.env.BACKEND_BASE_URL = 'http://test-api'

const mockSession = { accessToken: 'test-token' }

const mockBooking = {
    uuid: 'b-1',
    itemUuid: 'i-1',
    userUuid: 'u-1',
    startAt: '2026-08-01T10:00:00Z',
    endAt: '2026-08-07T10:00:00Z',
    createdAt: '2026-07-08T09:00:00Z',
    status: 'CONFIRMED',
}

const mockPage = {
    content: [mockBooking],
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

describe('getMyBookings', () => {
    test('calls GET /user/item/booking and returns page data', async () => {
        mockFetchOk(mockPage)
        const result = await getMyBookings(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/booking'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getMyBookings(mockSession)
        expect(result).toBeNull()
    })
})

describe('getBookingsForItem', () => {
    test('calls GET /user/item/:itemUuid/booking and returns page data', async () => {
        mockFetchOk(mockPage)
        const result = await getBookingsForItem('i-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/i-1/booking'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getBookingsForItem('i-1', mockSession)
        expect(result).toBeNull()
    })
})

describe('getBooking', () => {
    test('calls GET /user/item/booking/:uuid and returns booking', async () => {
        mockFetchOk(mockBooking)
        const result = await getBooking('b-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/booking/b-1'),
            expect.any(Object)
        )
        expect(result).toEqual(mockBooking)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getBooking('b-1', mockSession)
        expect(result).toBeNull()
    })
})

describe('approveBooking', () => {
    test('calls PATCH /user/item/booking/:uuid/approve', async () => {
        mockFetchOk(null)
        await approveBooking('b-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/booking/b-1/approve'),
            expect.objectContaining({ method: 'PATCH' })
        )
    })

    test('does not throw on error response', async () => {
        mockFetchError()
        await expect(approveBooking('b-1', mockSession)).resolves.toBeUndefined()
    })
})

describe('declineBooking', () => {
    test('calls PATCH /user/item/booking/:uuid/decline', async () => {
        mockFetchOk(null)
        await declineBooking('b-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/booking/b-1/decline'),
            expect.objectContaining({ method: 'PATCH' })
        )
    })

    test('does not throw on error response', async () => {
        mockFetchError()
        await expect(declineBooking('b-1', mockSession)).resolves.toBeUndefined()
    })
})

describe('cancelBooking', () => {
    test('calls PATCH /user/item/booking/:uuid/cancel', async () => {
        mockFetchOk(null)
        await cancelBooking('b-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/booking/b-1/cancel'),
            expect.objectContaining({ method: 'PATCH' })
        )
    })

    test('does not throw on error response', async () => {
        mockFetchError()
        await expect(cancelBooking('b-1', mockSession)).resolves.toBeUndefined()
    })
})
