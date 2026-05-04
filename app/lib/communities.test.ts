import {
    getAllCommunities,
    getOwnedCommunities,
    getMyCommunities,
    getCommunity,
    createCommunity,
    editCommunity,
    deleteCommunity,
    getItemsOfCommunity,
    getMemberOfCommunity,
    getReguestingMemberOfCommunity,
    approveMemberRequests,
    declineMemberRequests,
    joinCommunity,
} from './communities'

jest.mock('../utils/logger', () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}))

process.env.BACKEND_BASE_URL = 'http://test-api'

const mockSession = { accessToken: 'test-token' }

const mockCommunity = {
    uuid: 'com-1',
    name: 'Test Community',
    street: 'Main St',
    houseNumber: '1',
    postalCode: '12345',
    city: 'Test City',
    radius: 500,
    latitude: 48.0,
    longitude: 11.0,
    canBeJoined: true,
}

const mockPage = {
    content: [mockCommunity],
    isFirstPage: true,
    isLastPage: true,
    pageNumber: 0,
    pageSize: 10,
    totalElements: 1,
    totalPages: 1,
}

const mockUserPage = {
    content: [{ uuid: 'user-1', firstName: 'Jane', lastName: 'Doe' }],
    isFirstPage: true,
    isLastPage: true,
    pageNumber: 0,
    pageSize: 10,
    totalElements: 1,
    totalPages: 1,
}

function mockFetchOk(data: any) {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => data,
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

describe('getAllCommunities', () => {
    test('calls /user/community and returns page data', async () => {
        mockFetchOk(mockPage)
        const result = await getAllCommunities(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        expect(await getAllCommunities(mockSession)).toBeNull()
    })
})

describe('getOwnedCommunities', () => {
    test('calls /user/community/owned and returns page data', async () => {
        mockFetchOk(mockPage)
        const result = await getOwnedCommunities(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/owned'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        expect(await getOwnedCommunities(mockSession)).toBeNull()
    })
})

describe('getMyCommunities', () => {
    test('calls /user/community/my and returns page data', async () => {
        mockFetchOk(mockPage)
        const result = await getMyCommunities(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/my'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        expect(await getMyCommunities(mockSession)).toBeNull()
    })
})

describe('getCommunity', () => {
    test('calls /user/community/:uuid and returns community', async () => {
        mockFetchOk(mockCommunity)
        const result = await getCommunity('com-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1'),
            expect.any(Object)
        )
        expect(result).toEqual(mockCommunity)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        expect(await getCommunity('com-1', mockSession)).toBeNull()
    })
})

describe('createCommunity', () => {
    test('calls POST /user/community and returns created community', async () => {
        mockFetchOk(mockCommunity)
        const result = await createCommunity(mockCommunity, mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community'),
            expect.objectContaining({ method: 'POST' })
        )
        expect(result).toEqual(mockCommunity)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        expect(await createCommunity(mockCommunity, mockSession)).toBeNull()
    })
})

describe('editCommunity', () => {
    test('calls PATCH /user/community/:uuid and returns updated community', async () => {
        mockFetchOk(mockCommunity)
        const result = await editCommunity(mockCommunity, mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1'),
            expect.objectContaining({ method: 'PATCH' })
        )
        expect(result).toEqual(mockCommunity)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        expect(await editCommunity(mockCommunity, mockSession)).toBeNull()
    })
})

describe('deleteCommunity', () => {
    test('calls DELETE /user/community/:uuid', async () => {
        mockFetchOk(null)
        await deleteCommunity('com-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1'),
            expect.objectContaining({ method: 'DELETE' })
        )
    })
})

describe('getItemsOfCommunity', () => {
    test('calls /user/community/:uuid/item and returns items page', async () => {
        mockFetchOk(mockPage)
        const result = await getItemsOfCommunity('com-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1/item'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })
})

describe('getMemberOfCommunity', () => {
    test('calls /user/community/:uuid/member and returns user page', async () => {
        mockFetchOk(mockUserPage)
        const result = await getMemberOfCommunity('com-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1/member'),
            expect.any(Object)
        )
        expect(result).toEqual(mockUserPage)
    })
})

describe('getReguestingMemberOfCommunity', () => {
    test('calls /user/community/:uuid/requesting-member and returns user page', async () => {
        mockFetchOk(mockUserPage)
        const result = await getReguestingMemberOfCommunity('com-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1/requesting-member'),
            expect.any(Object)
        )
        expect(result).toEqual(mockUserPage)
    })
})

describe('approveMemberRequests', () => {
    test('calls POST /user/community/:uuid/request/approve with user UUIDs', async () => {
        mockFetchOk(mockUserPage)
        await approveMemberRequests('com-1', ['user-1'], mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1/request/approve'),
            expect.objectContaining({ method: 'POST' })
        )
    })
})

describe('declineMemberRequests', () => {
    test('calls POST /user/community/:uuid/request/decline with user UUIDs', async () => {
        mockFetchOk(mockUserPage)
        await declineMemberRequests('com-1', ['user-1'], mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1/request/decline'),
            expect.objectContaining({ method: 'POST' })
        )
    })
})

describe('joinCommunity', () => {
    test('calls /user/community/:uuid/join', async () => {
        mockFetchOk(null)
        await joinCommunity('com-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/community/com-1/join'),
            expect.any(Object)
        )
    })
})
