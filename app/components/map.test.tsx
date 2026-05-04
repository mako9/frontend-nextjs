import React from 'react'
import { render } from '@testing-library/react'
import Map from './map'

describe('Map', () => {
    test('renders the map container without crashing', () => {
        const { container } = render(
            <Map
                name="Test Community"
                latitude={48.137}
                longitude={11.576}
                radius={500}
            />
        )
        expect(container.querySelector('#map')).toBeInTheDocument()
    })
})
