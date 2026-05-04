import {
    getOwnedItems,
    getAllItemsOfMyCommunities,
    getItem,
    createItem,
    editItem,
    deleteItem,
    getItemImageUuids,
    getItemImage,
    uploadItemImage,
    deleteItemImage,
    bookItem,
} from './items'

jest.mock('../utils/logger', () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}))

process.env.BACKEND_BASE_URL = 'http://test-api'

const mockSession = { accessToken: 'test-token' }

const mockItem = {
    uuid: 'item-1',
    name: 'Test Item',
    categories: ['TOOL'],
    street: 'Main St',
    houseNumber: '1',
    postalCode: '12345',
    city: 'Test City',
    communityUuid: 'com-1',
    userUuid: 'user-1',
    active: true,
    availability: [],
    availableUntil: null,
    description: 'A description',
    communityName: 'Test Community',
    firstImageUuid: 'img-1',
}

const mockPage = {
    content: [mockItem],
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

describe('getOwnedItems', () => {
    test('calls /user/item/owned and returns page data', async () => {
        mockFetchOk(mockPage)
        const result = await getOwnedItems(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/owned'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getOwnedItems(mockSession)
        expect(result).toBeNull()
    })
})

describe('getAllItemsOfMyCommunities', () => {
    test('calls /user/item/my and returns page data', async () => {
        mockFetchOk(mockPage)
        const result = await getAllItemsOfMyCommunities(mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/my'),
            expect.any(Object)
        )
        expect(result).toEqual(mockPage)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getAllItemsOfMyCommunities(mockSession)
        expect(result).toBeNull()
    })
})

describe('getItem', () => {
    test('calls /user/item/:uuid and returns item', async () => {
        mockFetchOk(mockItem)
        const result = await getItem('item-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/item-1'),
            expect.any(Object)
        )
        expect(result).toEqual(mockItem)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getItem('item-1', mockSession)
        expect(result).toBeNull()
    })
})

describe('createItem', () => {
    test('calls POST /user/item and returns created item', async () => {
        mockFetchOk(mockItem)
        const result = await createItem(mockItem, mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item'),
            expect.objectContaining({ method: 'POST' })
        )
        expect(result).toEqual(mockItem)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await createItem(mockItem, mockSession)
        expect(result).toBeNull()
    })
})

describe('editItem', () => {
    test('calls PATCH /user/item/:uuid and returns updated item', async () => {
        mockFetchOk(mockItem)
        const result = await editItem(mockItem, mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/item-1'),
            expect.objectContaining({ method: 'PATCH' })
        )
        expect(result).toEqual(mockItem)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await editItem(mockItem, mockSession)
        expect(result).toBeNull()
    })
})

describe('deleteItem', () => {
    test('calls DELETE /user/item/:uuid', async () => {
        mockFetchOk(null)
        await deleteItem('item-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/item-1'),
            expect.objectContaining({ method: 'DELETE' })
        )
    })
})

describe('getItemImageUuids', () => {
    test('calls /user/item/:uuid/image and returns uuid array', async () => {
        const uuids = ['img-1', 'img-2']
        mockFetchOk(uuids)
        const result = await getItemImageUuids('item-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/item-1/image'),
            expect.any(Object)
        )
        expect(result).toEqual(uuids)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getItemImageUuids('item-1', mockSession)
        expect(result).toBeNull()
    })
})

describe('getItemImage', () => {
    test('calls /user/item/image/:uuid and returns blob', async () => {
        const mockBlob = new Blob(['image data'])
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            status: 200,
            blob: async () => mockBlob,
        } as any)
        const result = await getItemImage('img-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/image/img-1'),
            expect.any(Object)
        )
        expect(result).toEqual(mockBlob)
    })

    test('returns null on error response', async () => {
        mockFetchError()
        const result = await getItemImage('img-1', mockSession)
        expect(result).toBeNull()
    })
})

describe('uploadItemImage', () => {
    test('calls POST /user/item/:uuid/image', async () => {
        mockFetchOk(null)
        const file = new File(['image'], 'photo.jpg', { type: 'image/jpeg' })
        await uploadItemImage('item-1', file, mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/item-1/image'),
            expect.objectContaining({ method: 'POST' })
        )
    })
})

describe('deleteItemImage', () => {
    test('calls DELETE /user/item/image/:uuid', async () => {
        mockFetchOk(null)
        await deleteItemImage('img-1', mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/image/img-1'),
            expect.objectContaining({ method: 'DELETE' })
        )
    })
})

describe('bookItem', () => {
    test('calls POST /user/item/:uuid/booking with start and end dates', async () => {
        mockFetchOk(null)
        const start = new Date('2026-06-01T10:00:00')
        const end = new Date('2026-06-07T10:00:00')
        await bookItem('item-1', start, end, mockSession)
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/user/item/item-1/booking'),
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining(start.toISOString()),
            })
        )
    })
})
