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
 * the four names are the whole contract.
 * **Corrected 2026-11-24, measured on the artifact:** this comment claimed an interval carrying unrecognised
 * keys is answered with HTTP 400. It is not - unknown properties are ignored, a fifth key is accepted and comes
 * back dropped. Two consequences worth knowing before extending this type: a fifth field added server-side
 * round-trips through the web (the value here is whatever `JSON.parse` produced, keys and all) but is dropped by
 * the Flutter model, which rebuilds the map from the four fields - so it survives a web save and dies on a
 * mobile save; and the server normalises `OffsetTime` to UTC (`08:30+01:00` is answered as `08:30Z`), so a
 * `string` here is only as meaningful as the writer's discipline.
 * No UI reads these fields yet - the availability editor is plan 2d's - but nothing may invent a second shape
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
