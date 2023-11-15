import { Item } from '../models/item'
import { Page } from '../models/pageModel'
import { MimeType, HttpMethod, request } from '../utils/request'

export async function getOwnedItems(session?): Promise<Page<Item> | null> {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/owned`
    const result = await request<Page<Item>>(url, session)
    return result.data
}

export async function getAllItemsOfMyCommunities(
    session?
): Promise<Page<Item> | null> {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/my`
    const result = await request<Page<Item>>(url, session)
    return result.data
}

export async function getItem(uuid, session?): Promise<Item | null> {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}`
    const result = await request<Item>(url, session)
    return result.data
}

export async function deleteItem(uuid, session?) {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}`
    await request<Item>(url, session, HttpMethod.Delete)
}

export async function editItem(item: Item, session?): Promise<Item | null> {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/${item.uuid}`
    const result = await request<Item>(url, session, HttpMethod.Patch, item)
    return result.data
}

export async function getItemImageUuids(
    uuid,
    session?
): Promise<[String] | null> {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}/image`
    const result = await request<[String]>(url, session)
    return result.data
}

export async function getItemImage(uuid, session?): Promise<Blob | null> {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/image/${uuid}`
    const result = await request<Blob>(
        url,
        session,
        HttpMethod.Get,
        null,
        MimeType.json,
        MimeType.octetStream
    )
    return result.data
}

export async function uploadItemImage(uuid, data, session?) {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}/image`
    await request<String>(
        url,
        session,
        HttpMethod.Post,
        data,
        MimeType.formData,
        MimeType.textPlain
    )
}

export async function deleteItemImage(uuid, session?) {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/image/${uuid}`
    await request<Item>(url, session, HttpMethod.Delete)
}

export async function bookItem(
    uuid: String,
    startDate: Date,
    endDate: Date,
    session?
) {
    const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}/booking`
    await request<String>(url, session, HttpMethod.Post, {
        startAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
    })
}
