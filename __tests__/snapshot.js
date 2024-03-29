// __tests__/snapshot.js

import { render } from '@testing-library/react'
import Home from '../pages/index'

it('renders homepage unchanged', () => {
    const { container } = render(
        <Home allCommunitiesData={[]} allItemsData={[]} />
    )
    expect(container).toMatchSnapshot()
})
