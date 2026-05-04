import React from 'react'
import { render, screen } from '@testing-library/react'
import Community, { getServerSideProps } from '../../../pages/communities/[id]'
import { StateProvider } from '../../../app/components/context'

jest.mock('app/lib/communities', () => ({
    getCommunity: jest.fn(),
    getMemberOfCommunity: jest.fn(),
    getReguestingMemberOfCommunity: jest.fn(),
}))
jest.mock('app/utils/session', () => ({
    getServerSideSession: jest.fn().mockResolvedValue({ accessToken: 'token' }),
}))
jest.mock('app/components/subpages/ownedCommunity', () =>
    jest.fn(() => <div data-testid="owned-community">Owned Community View</div>)
)
jest.mock('app/components/subpages/foreignCommunity', () =>
    jest.fn(() => <div data-testid="foreign-community">Foreign Community View</div>)
)

const { getCommunity, getMemberOfCommunity, getReguestingMemberOfCommunity } =
    require('app/lib/communities')

const mockCommunity = {
    uuid: 'com-1', name: 'Test Community', street: 'Main St', houseNumber: '1',
    postalCode: '12345', city: 'Munich', radius: 500, latitude: 48.0, longitude: 11.0, canBeJoined: true,
}
const mockMembersPage = { content: [], isFirstPage: true, isLastPage: true, pageNumber: 0, pageSize: 10, totalElements: 0, totalPages: 0 }

describe('Community page — getServerSideProps', () => {
    beforeEach(() => {
        getCommunity.mockResolvedValue(mockCommunity)
        getMemberOfCommunity.mockResolvedValue(mockMembersPage)
        getReguestingMemberOfCommunity.mockResolvedValue(mockMembersPage)
    })

    test('fetches community and member data and returns as props', async () => {
        const context = { req: {}, res: {}, params: { id: 'com-1' }, query: { isOwned: 'false' }, locale: 'en' }
        const result = await getServerSideProps(context as any)
        if ('props' in result) {
            expect(result.props.communityData).toEqual(mockCommunity)
            expect(getCommunity).toHaveBeenCalledWith('com-1', expect.any(Object))
        }
    })
})

describe('Community page — component', () => {
    test('renders foreign community view when isOwned is false', () => {
        render(
            <StateProvider>
                <Community
                    communityData={mockCommunity}
                    members={mockMembersPage}
                    requestingMember={mockMembersPage}
                    isOwned="false"
                />
            </StateProvider>
        )
        expect(screen.getByTestId('foreign-community')).toBeInTheDocument()
    })

    test('renders owned community view when isOwned is true', () => {
        render(
            <StateProvider>
                <Community
                    communityData={mockCommunity}
                    members={mockMembersPage}
                    requestingMember={mockMembersPage}
                    isOwned="true"
                />
            </StateProvider>
        )
        expect(screen.getByTestId('owned-community')).toBeInTheDocument()
    })

    test('renders nothing when communityData is null', () => {
        const { container } = render(
            <StateProvider>
                <Community
                    communityData={null}
                    members={mockMembersPage}
                    requestingMember={mockMembersPage}
                    isOwned="false"
                />
            </StateProvider>
        )
        expect(container.firstChild).toBeNull()
    })
})
