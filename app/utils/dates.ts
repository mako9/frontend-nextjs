/**
 * Dates shown to a person are formatted in the locale of the page, never the locale of whichever machine
 * is doing the rendering.
 *
 * The pages here are server-rendered, and an unqualified `toLocaleDateString()` asks Node on the server
 * and Chromium in the browser - which answer differently ("12/14/2026" against "14.12.2026"). React 19
 * treats that difference as a hydration failure and throws away the rendered tree. Passing the active
 * language makes both sides agree, and it is also what makes a German page show German dates.
 */
export function formatDate(value: string | number | Date, language?: string): string {
    return new Date(value).toLocaleDateString(language)
}

export function formatDateTime(value: string | number | Date, language?: string): string {
    return new Date(value).toLocaleString(language)
}
