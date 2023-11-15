import { render } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'

test('renders the component with the correct data', () => {
    const allCommunitiesData = [
        {
            uuid: '95C87636-8320-4155-AEEF-1BA973C872CA',
            name: 'Community 1',
            createdAt: '2022-01-01',
        },
        {
            uuid: '15C87636-8320-4155-AEEF-1BA973C872CA',
            name: 'Community 2',
            createdAt: '2022-01-02',
        },
    ]

    const { getByText } = render(
        <Home allCommunitiesData={allCommunitiesData} allItemsData={[]} />
    )

    expect(getByText('Community 1')).toBeInTheDocument()
    expect(getByText('Community 2')).toBeInTheDocument()
})
