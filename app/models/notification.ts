export type NotificationType = 'BOOKING_REQUEST' | 'BOOKING_CONFIRMED' | 'BOOKING_DECLINED' | 'BOOKING_CANCELLED'

export type AppNotification = {
    uuid: string
    type: NotificationType
    bookingUuid?: string
    read: boolean
    createdAt: string
}

export type UnreadCount = {
    count: number
}
