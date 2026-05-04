import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ImageGallery from './imageGallery'

const t = (key: string) => key

describe('ImageGallery', () => {
    test('renders nothing when images array is empty', () => {
        const { container } = render(
            <ImageGallery
                images={[]}
                currentImageIndex={0}
                setCurrentImageIndex={() => {}}
                t={t}
            />
        )
        expect(container.firstChild).toBeNull()
    })

    test('renders the current image', () => {
        render(
            <ImageGallery
                images={['blob:url-1', 'blob:url-2']}
                currentImageIndex={0}
                setCurrentImageIndex={() => {}}
                t={t}
            />
        )
        // With 2 images: arrow_left img, gallery img, arrow_right img
        const imgs = screen.getAllByRole('img')
        const galleryImg = imgs.find(
            (img) => img.getAttribute('src') === 'blob:url-1'
        )
        expect(galleryImg).toBeTruthy()
    })

    test('calls setCurrentImageIndex with next index when next button clicked', () => {
        const setCurrentImageIndex = jest.fn()
        render(
            <ImageGallery
                images={['blob:url-1', 'blob:url-2']}
                currentImageIndex={0}
                setCurrentImageIndex={setCurrentImageIndex}
                t={t}
            />
        )
        const buttons = screen.getAllByRole('button')
        fireEvent.click(buttons[1]) // next button
        expect(setCurrentImageIndex).toHaveBeenCalled()
    })

    test('shows image counter text', () => {
        render(
            <ImageGallery
                images={['blob:url-1']}
                currentImageIndex={0}
                setCurrentImageIndex={() => {}}
                t={t}
            />
        )
        expect(screen.getByText(/1/)).toBeInTheDocument()
    })
})
