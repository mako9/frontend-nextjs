import { formatDate, formatDateTime } from './dates'

const utcNoon = '2026-12-14T12:00:00.000Z'

describe('date formatting', () => {
    // the reason this exists: Node and Chromium disagree about an unqualified toLocaleDateString(), and
    // React 19 calls that a hydration failure. Pinning the language is what makes them agree.
    test('formats in the language it is given', () => {
        expect(formatDate(utcNoon, 'de')).toBe('14.12.2026')
        expect(formatDate(utcNoon, 'en-US')).toBe('12/14/2026')
    })

    test('formats date and time in the language it is given', () => {
        expect(formatDateTime(utcNoon, 'de')).toContain('14.12.2026')
        expect(formatDateTime(utcNoon, 'en-US')).toContain('12/14/2026')
    })

    // pages under test get an empty i18n object, and a date still has to render
    test('falls back to the machine locale when no language is known', () => {
        expect(formatDate(utcNoon)).toBeTruthy()
        expect(formatDateTime(utcNoon)).toBeTruthy()
    })
})
