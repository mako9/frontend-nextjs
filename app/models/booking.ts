export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'RETURNED'
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
    returnedBy?: CancelledBy
    returnedAt?: string
    isItemOwner: boolean
}

export type BookingDateRange = {
    startAt: string
    endAt: string
}
