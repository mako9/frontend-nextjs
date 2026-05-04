import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Gallery from './gallery'

const items = [
    { uuid: 'item-1', name: 'Drill' },
    { uuid: 'item-2', name: 'Lawn Mower' },
]
const images = [
    { uuid: 'item-1', imageUrl: 'blob:url-1' },
]

describe('Gallery', () => {
    test('renders the gallery title', () => {
        render(
            <Gallery
                title="Available Items"
                items={items}
                images={images}
                onClick={() => {}}
            />
        )
        expect(screen.getByText('Available Items')).toBeInTheDocument()
    })

    test('renders all item names', () => {
        render(
            <Gallery
                title="Available Items"
                items={items}
                images={images}
                onClick={() => {}}
            />
        )
        expect(screen.getByText('Drill')).toBeInTheDocument()
        expect(screen.getByText('Lawn Mower')).toBeInTheDocument()
    })

    test('calls onClick with item uuid when item is clicked', () => {
        const onClick = jest.fn()
        render(
            <Gallery
                title="Available Items"
                items={items}
                images={images}
                onClick={onClick}
            />
        )
        fireEvent.click(screen.getByText('Drill'))
        expect(onClick).toHaveBeenCalledWith('item-1')
    })
})
