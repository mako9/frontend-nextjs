import React from 'react'
import { render, screen } from '@testing-library/react'
import foreignItem from './foreignItem'

jest.mock('../../lib/items', () => ({
    getItemImage: jest.fn().mockResolvedValue(new Blob(['img'])),
    bookItem: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('../datePicker', () => ({
    __esModule: true,
    default: ({ selectedDate, excludeDateIntervals }: any) => (
        <div data-testid="date-picker">
            {JSON.stringify(excludeDateIntervals ?? [])}|
            {(excludeDateIntervals ?? []).length}
        </div>
    ),
}))

const t = (key: string) => key
const bookedDates = [
    { startAt: '2026-06-04T09:00:00.000Z', endAt: '2026-06-06T17:00:00.000Z' },
    { startAt: '2026-06-20T09:00:00.000Z', endAt: '2026-06-21T17:00:00.000Z' },
]
// not a full Session, and the lib functions only pass it through; the cast is what the
// type checker needs (Phase 1 reduces the remaining fixtures the same way)
const mockSession = { accessToken: 'token' } as any
const mockItemData: any = {
    uuid: 'item-1',
    name: 'Lawn Mower',
    categories: ['GARDENING'],
    street: 'Oak Ave',
    houseNumber: '3',
    postalCode: '80331',
    city: 'Munich',
    communityUuid: 'com-1',
    userUuid: 'user-2',
    active: true,
    availability: [],
    availableUntil: null,
    description: 'Great for the garden',
    communityName: 'Green Neighborhood',
    firstImageUuid: null,
    requiresApproval: false,
}

const Wrapper = () => foreignItem(mockSession, mockItemData, [], [], t)

describe('foreignItem', () => {
    test('renders item name', () => {
        render(<Wrapper />)
        expect(screen.getByText('Lawn Mower')).toBeInTheDocument()
    })

    test('renders item description', () => {
        render(<Wrapper />)
        expect(screen.getByText('Great for the garden')).toBeInTheDocument()
    })

    test('renders category label', () => {
        render(<Wrapper />)
        expect(screen.getByText('item.category.gardening')).toBeInTheDocument()
    })

    test('renders request button', () => {
        render(<Wrapper />)
        expect(
            screen.getByRole('button', { name: 'item.requestItem' })
        ).toBeInTheDocument()
    })

    test('renders start and end date pickers', () => {
        render(<Wrapper />)
        const pickers = screen.getAllByTestId('date-picker')
        expect(pickers).toHaveLength(2)
    })

    test('renders approval required notice when requiresApproval is true', () => {
        const itemWithApproval = { ...mockItemData, requiresApproval: true }
        const WrapperWithApproval = () => foreignItem(mockSession, itemWithApproval, [], [], t)
        render(<WrapperWithApproval />)
        expect(screen.getByText('item.approvalRequired')).toBeInTheDocument()
    })

    test('does not render approval required notice when requiresApproval is false', () => {
        render(<Wrapper />)
        expect(screen.queryByText('item.approvalRequired')).not.toBeInTheDocument()
    })

    describe('already-booked dates', () => {
        const WrapperBooked = () => foreignItem(mockSession, mockItemData, [], bookedDates, t)

        test('hands the booked ranges to both date pickers', () => {
            render(<WrapperBooked />)
            const pickers = screen.getAllByTestId('date-picker')
            expect(pickers).toHaveLength(2)
            pickers.forEach((picker) => expect(picker.textContent).toMatch(/\|2$/))
        })

        // the picker's day cells all sit at midnight, so an interval that starts at nine in the morning
        // would leave the day it starts on selectable - which is not "taken" to the person looking at a
        // calendar. The server keeps applying the real overlap rule; the calendar speaks in whole days.
        test('blocks the whole of every booked day, not just the part after the handover time', () => {
            render(<WrapperBooked />)
            const [picker] = screen.getAllByTestId('date-picker')
            const intervals = JSON.parse(picker.textContent.split('|')[0])
            expect(intervals).toHaveLength(2)
            for (const interval of intervals) {
                const start = new Date(interval.start)
                const end = new Date(interval.end)
                expect([start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds()]).toEqual([0, 0, 0, 0])
                expect([end.getHours(), end.getMinutes()]).toEqual([23, 59])
                expect(start.getTime()).toBeLessThan(new Date(bookedDates[intervals.indexOf(interval)].startAt).getTime())
                expect(end.getTime()).toBeGreaterThan(new Date(bookedDates[intervals.indexOf(interval)].endAt).getTime())
            }
        })

        test('says that some dates are taken, when some are', () => {
            render(<WrapperBooked />)
            expect(screen.getByText('item.alreadyBooked')).toBeInTheDocument()
        })

        test('says nothing about booked dates, and excludes nothing, for an unbooked item', () => {
            render(<Wrapper />)
            expect(screen.queryByText('item.alreadyBooked')).not.toBeInTheDocument()
            screen.getAllByTestId('date-picker').forEach((picker) =>
                expect(picker.textContent).toMatch(/\|0$/)
            )
        })
    })
})
