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
    active: boolean
    availability: Array<ItemTimeInterval>
    availableUntil: string | null
    description: string
    communityName: string
    firstImageUuid: string | null
    requiresApproval?: boolean
}

/** What the backend calls ItemTimeIntervalDto: a window in which the item can be lent out. */
export type ItemTimeInterval = {
    startAt: string
    endAt: string
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
