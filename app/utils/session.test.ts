import { getServerSideSession } from './session'
import { getServerSession } from 'next-auth'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}))

jest.mock('../../pages/api/auth/[...nextauth]', () => ({
    authOptions: {},
}))

const mockContext = { req: {}, res: {} }

describe('getServerSideSession', () => {
    test('returns session when getServerSession resolves with a session', async () => {
        const mockSession = { accessToken: 'token', user: { email: 'test@example.com' } }
        ;(getServerSession as jest.Mock).mockResolvedValueOnce(mockSession)

        const result = await getServerSideSession(mockContext)

        expect(result).toEqual(mockSession)
    })

    test('returns null when getServerSession resolves with null', async () => {
        ;(getServerSession as jest.Mock).mockResolvedValueOnce(null)

        const result = await getServerSideSession(mockContext)

        expect(result).toBeNull()
    })
})
