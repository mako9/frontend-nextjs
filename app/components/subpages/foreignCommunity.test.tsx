import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import foreignCommunity from './foreignCommunity'

jest.mock('../../lib/communities', () => ({
    joinCommunity: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('next/dynamic', () =>
    jest.fn(() => {
        const MockMap = () => <div data-testid="mock-map" />
        MockMap.displayName = 'MockMap'
        return MockMap
    })
)

const t = (key: string) => key
const mockSession = { accessToken: 'token' }
const mockCommunityData = {
    uuid: 'com-1',
    name: 'Green Neighborhood',
    street: 'Oak Ave',
    houseNumber: '5',
    postalCode: '80331',
    city: 'Munich',
    radius: 300,
    latitude: 48.137,
    longitude: 11.576,
    canBeJoined: true,
}

const Wrapper = () => foreignCommunity(mockSession, mockCommunityData, t)

describe('foreignCommunity', () => {
    test('renders community name', () => {
        render(<Wrapper />)
        expect(screen.getByText('Green Neighborhood')).toBeInTheDocument()
    })

    test('renders community address details', () => {
        render(<Wrapper />)
        expect(screen.getByText('Oak Ave')).toBeInTheDocument()
        expect(screen.getByText('Munich')).toBeInTheDocument()
    })

    test('join button is enabled when canBeJoined is true', () => {
        render(<Wrapper />)
        expect(
            screen.getByRole('button', { name: 'community.requestMembership' })
        ).not.toBeDisabled()
    })

    test('join button is disabled when canBeJoined is false', () => {
        const notJoinable = { ...mockCommunityData, canBeJoined: false }
        const NotJoinableWrapper = () => foreignCommunity(mockSession, notJoinable, t)
        render(<NotJoinableWrapper />)
        expect(
            screen.getByRole('button', { name: 'community.requestMembership' })
        ).toBeDisabled()
    })
})
