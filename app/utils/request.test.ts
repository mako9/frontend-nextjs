import { request, clientSideRequest, HttpMethod, MimeType } from './request'

jest.mock('./logger', () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}))

const mockSession = { accessToken: 'test-token' }

function mockFetchOk(data: any) {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => data,
        blob: async () => data,
        body: data,
    } as any)
}

function mockFetchError(status: number, statusText: string) {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status,
        statusText,
        json: async () => ({ message: statusText }),
    } as any)
}

afterEach(() => {
    ;(global.fetch as jest.Mock).mockReset()
})

describe('request', () => {
    test('GET with session calls correct URL with Authorization header and returns data', async () => {
        const data = { id: 1, name: 'test' }
        mockFetchOk(data)

        const result = await request('http://api/test', mockSession)

        expect(fetch).toHaveBeenCalledWith(
            'http://api/test',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-token',
                }),
            })
        )
        expect(result.data).toEqual(data)
        expect(result.statusCode).toBe(200)
        expect(result.errorMessage).toBeNull()
    })

    test('returns 401 and skips fetch when session is null', async () => {
        const result = await request('http://api/test', null)

        expect(global.fetch).not.toHaveBeenCalled()
        expect(result.data).toBeNull()
        expect(result.statusCode).toBe(401)
    })

    test('returns 401 and skips fetch when accessToken is missing', async () => {
        const result = await request('http://api/test', { accessToken: null })

        expect(global.fetch).not.toHaveBeenCalled()
        expect(result.data).toBeNull()
        expect(result.statusCode).toBe(401)
    })

    test('POST with body sends serialized JSON and correct Content-Type', async () => {
        const body = { name: 'test' }
        mockFetchOk({ id: 1 })

        await request('http://api/test', mockSession, HttpMethod.Post, body)

        expect(fetch).toHaveBeenCalledWith(
            'http://api/test',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': MimeType.json,
                }),
                body: JSON.stringify(body),
            })
        )
    })

    test('returns null data with statusCode and errorMessage on non-ok response', async () => {
        mockFetchError(500, 'Internal Server Error')

        const result = await request('http://api/test', mockSession)

        expect(result.data).toBeNull()
        expect(result.statusCode).toBe(500)
        expect(result.errorMessage).toBe('Internal Server Error')
    })

    test('clears session accessToken on 401 response', async () => {
        mockFetchError(401, 'Unauthorized')
        const session = { accessToken: 'test-token' }

        await request('http://api/test', session)

        expect(session.accessToken).toBe('')
    })
})

describe('clientSideRequest', () => {
    test('sets isLoading true before call and false after, passes args, returns result', async () => {
        const mockFn = jest.fn().mockResolvedValue('result')
        const state = { isLoading: false, selectedNavbarIndex: 0 }
        const setState = jest.fn()

        const wrapped = clientSideRequest(mockFn, state, setState)
        const result = await wrapped('arg1', 'arg2')

        expect(setState).toHaveBeenCalledWith({ ...state, isLoading: true })
        expect(setState).toHaveBeenCalledWith({ ...state, isLoading: false })
        expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
        expect(result).toBe('result')
    })
})
