import { ItemBooking } from '../models/booking'
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
