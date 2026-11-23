import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomDatePicker from './datePicker'

describe('CustomDatePicker', () => {
    beforeAll(() => {
        // jsdom has no ResizeObserver, and react-datepicker's time list needs one as soon as the
        // calendar mounts - without this, opening the picker throws before anything can be asserted
        ;(global as any).ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        }
    })

    test('renders without crashing', () => {
        const date = new Date('2026-06-01')
        render(
            <CustomDatePicker selectedDate={date} setSelectedDate={() => {}} />
        )
        // DatePicker renders an input
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    // the point of the prop: a neighbour must not be able to ask for days someone else already has
    test('disables the days of an excluded interval', () => {
        const { container } = render(
            <CustomDatePicker
                selectedDate={new Date('2026-06-10')}
                setSelectedDate={() => {}}
                excludeDateIntervals={[
                    { start: new Date('2026-06-04'), end: new Date('2026-06-06') },
                ]}
            />
        )
        fireEvent.click(screen.getByRole('textbox'))
        expect(
            container.querySelectorAll('.react-datepicker__day--disabled').length
        ).toBeGreaterThan(0)
    })

    test('disables nothing when no interval is excluded', () => {
        const { container } = render(
            <CustomDatePicker
                selectedDate={new Date('2026-06-10')}
                setSelectedDate={() => {}}
            />
        )
        fireEvent.click(screen.getByRole('textbox'))
        expect(
            container.querySelectorAll('.react-datepicker__day--disabled').length
        ).toBe(0)
    })
})
