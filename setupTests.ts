import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { afterEach } from 'node:test'

afterEach(cleanup)

// Mock URL methods not available in jsdom
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
global.URL.revokeObjectURL = jest.fn()

// Make fetch mockable
global.fetch = jest.fn()

jest.mock('next-auth/react', () => ({
    useSession: jest.fn(() => ({
        data: {
            accessToken: 'mock-token',
            user: { email: 'test@example.com', name: 'Test User' },
            status: 'authenticated',
            expires: '9999-12-31',
        },
        status: 'authenticated',
    })),
    signIn: jest.fn(),
    signOut: jest.fn(),
}))

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(),
    getServerSession: jest.fn(),
}))

jest.mock('next-auth/next', () => ({
    unstable_getServerSession: jest.fn(() => ({
        accessToken: 'token',
        user: { email: 'test@example.com', name: 'Test User' },
        status: 'authenticated',
    })),
}))

jest.mock('next/router', () => ({
    __esModule: true,
    default: {
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        reload: jest.fn(),
        prefetch: jest.fn(),
    },
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        reload: jest.fn(),
        pathname: '/',
        route: '/',
        query: {},
        asPath: '/',
    })),
}))

jest.mock('next-i18next/pages', () => ({
    useTranslation: jest.fn(() => ({
        t: (key: string) => key,
        i18n: {},
    })),
}))

jest.mock('next-i18next/pages/serverSideTranslations', () => ({
    serverSideTranslations: jest.fn(() => Promise.resolve({})),
}))

jest.mock('react-swipeable', () => ({
    useSwipeable: jest.fn(() => ({})),
}))

jest.mock('leaflet', () => ({
    map: jest.fn(() => ({
        setView: jest.fn().mockReturnThis(),
    })),
    tileLayer: jest.fn(() => ({ addTo: jest.fn() })),
    Icon: jest.fn(),
    marker: jest.fn(() => ({
        addTo: jest.fn().mockReturnThis(),
        bindPopup: jest.fn().mockReturnThis(),
        openPopup: jest.fn().mockReturnThis(),
    })),
    circle: jest.fn(() => ({ addTo: jest.fn() })),
}))
