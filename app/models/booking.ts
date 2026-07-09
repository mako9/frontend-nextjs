export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED'
export type CancelledBy = 'OWNER' | 'REQUESTER'

export type ItemBooking = {
    uuid: string
    itemUuid: string
    userUuid: string
    startAt: string
    endAt: string
    createdAt: string
    status: BookingStatus
    cancelledBy?: CancelledBy
    cancelledAt?: string
}
