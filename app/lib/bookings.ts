import { BookingDateRange, ItemBooking } from '../models/booking'
import { Page } from '../models/pageModel'
import { HttpMethod, request } from '../utils/request'

const bookingPath = (p: string) => `${process.env.BACKEND_BASE_URL}/user/item${p}`

export async function getMyBookings(session?): Promise<Page<ItemBooking> | null> {
    const result = await request<Page<ItemBooking>>(bookingPath('/booking'), session)
    return result.data
}

export async function getBookingsForItem(itemUuid: string, session?): Promise<Page<ItemBooking> | null> {
    const result = await request<Page<ItemBooking>>(bookingPath(`/${itemUuid}/booking`), session)
    return result.data
}

export async function getBooking(bookingUuid: string, session?): Promise<ItemBooking | null> {
    const result = await request<ItemBooking>(bookingPath(`/booking/${bookingUuid}`), session)
    return result.data
}

export async function approveBooking(bookingUuid: string, session?) {
    await request(bookingPath(`/booking/${bookingUuid}/approve`), session, HttpMethod.Patch)
}

export async function declineBooking(bookingUuid: string, session?) {
    await request(bookingPath(`/booking/${bookingUuid}/decline`), session, HttpMethod.Patch)
}

export async function cancelBooking(bookingUuid: string, session?) {
    await request(bookingPath(`/booking/${bookingUuid}/cancel`), session, HttpMethod.Patch)
}

export async function getReceivedBookings(session?): Promise<Page<ItemBooking> | null> {
    const result = await request<Page<ItemBooking>>(bookingPath('/booking/received'), session)
    return result.data
}

export async function returnBooking(bookingUuid: string, session?) {
    await request(bookingPath(`/booking/${bookingUuid}/return`), session, HttpMethod.Patch)
}

/**
 * The slots other neighbours already have. A failed lookup leaves the date picker as it was, so an empty
 * list is the only sensible answer - `null` would push every caller to re-check.
 */
export async function getBookingDates(itemUuid: string, session?): Promise<BookingDateRange[]> {
    const result = await request<BookingDateRange[]>(bookingPath(`/${itemUuid}/booking/dates`), session)
    return result.data ?? []
}
