import React from 'react'
import { render } from '@testing-library/react'
import Spinner from './spinner'

describe('Spinner', () => {
    test('renders without crashing', () => {
        const { container } = render(<Spinner />)
        expect(container.firstChild).toBeInTheDocument()
    })
})
