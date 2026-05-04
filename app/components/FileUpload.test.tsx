import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FileUpload from './FileUpload'

const t = (key: string) => key

describe('FileUpload', () => {
    test('renders the upload button title', () => {
        render(
            <FileUpload title="Upload Image" handleUploadedFile={() => {}} t={t} />
        )
        expect(screen.getByText('Upload Image')).toBeInTheDocument()
    })

    test('shows no file selected text initially', () => {
        render(
            <FileUpload title="Upload Image" handleUploadedFile={() => {}} t={t} />
        )
        expect(screen.getByText('noFileSelected')).toBeInTheDocument()
    })

    test('calls handleUploadedFile with selected file when upload button clicked', () => {
        const handleUploadedFile = jest.fn()
        render(
            <FileUpload
                title="Upload Image"
                handleUploadedFile={handleUploadedFile}
                t={t}
            />
        )

        const file = new File(['image data'], 'photo.jpg', { type: 'image/jpeg' })
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        fireEvent.change(fileInput, { target: { files: [file] } })

        // Button becomes enabled after file selection
        const uploadButton = screen.getByRole('button', { name: 'Upload Image' })
        fireEvent.click(uploadButton)

        expect(handleUploadedFile).toHaveBeenCalledWith(file)
    })
})
