export type Item = {
    uuid: string
    name: string
    categories: Array<string>
    street: string
    houseNumber: string
    postalCode: string
    city: string
    communityUuid: string
    userUuid: string
    isActive: boolean
    availability: Array<ItemTimeInterval>
    availableUntil: string | null
    description: string
    communityName: string
    firstImageUuid: string | null
    requiresApproval?: boolean
}

/**
 * What the backend calls `ItemTimeIntervalDto`: one weekly window in which the item can be lent out.
 * Shape taken from the packaged artifact on 2026-11-23, not from the DTO's name - `GET
 * /api/user/item/{uuid}` answered
 * `{"startDayOfWeek": 1, "endDayOfWeek": 3, "startTimeAt": "09:00Z", "endTimeAt": "17:00Z"}`.
 * Days are `java.time.DayOfWeek`, so 1 = Monday … 7 = Sunday; the times are `OffsetTime` text.
 * The keys have to match exactly: `ownedItem.tsx` posts `itemData.availability` straight back on update, and
 * the artifact answers an interval with unrecognised keys with HTTP 400 (measured) rather than ignoring it.
 * No UI reads these fields yet - the availability editor is Phase 2c's - but nothing may invent a second shape
 * for it either.
 */
export type ItemTimeInterval = {
    startDayOfWeek: number
    endDayOfWeek: number
    startTimeAt: string
    endTimeAt: string
}

export type ItemImage = {
    uuid: string
    imageUrl: string
}

export function itemCategories(t) {
    return [
        { id: 'HOUSEKEEPING', label: t('item.category.housekeeping') },
        { id: 'GARDENING', label: t('item.category.gardening') },
        { id: 'TOOL', label: t('item.category.tool') },
        { id: 'ELECTRIC_DEVICE', label: t('item.category.electicDevice') },
        { id: 'OTHER', label: t('item.category.other') },
    ]
}
