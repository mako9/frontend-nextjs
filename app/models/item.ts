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
    availability: string
    availableUntil: string
    description: string
    communityName: string
    firstImageUuid: string
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
