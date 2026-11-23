import { Session } from 'next-auth'

/** A complete Session as augmented in pages/api/auth/[...nextauth].ts.
 *  accessToken is widened because request() is specified to 401 on a missing token. */
export function session(overrides: Partial<Session> = {}): Session {
    return {
        status: 'ok',
        error: '',
        expires: '2999-01-01T00:00:00.000Z',
        accessToken: 'test-token',
        ...overrides,
    } as Session
}
