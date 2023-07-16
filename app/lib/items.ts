import { Item } from "../models/item";
import { Page } from "../models/page";
import { MimeType, HttpMethod, request } from "../utils/request";

export async function getAllItemsOfMyCommunities(session?): Promise<Page<Item>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/my`;
  const result = await request<Page<Item>>(url, session);
  return result.data;
}

export async function getOwnedItems(session?): Promise<Page<Item>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/owned`;
  const result = await request<Page<Item>>(url, session);
  return result.data;
}

export async function getItem(uuid, session?): Promise<Item> {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}`;
  const result = await request<Item>(url, session);
  return result.data;
}

export async function deleteItem(uuid, session?) {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}`;
  await request<Item>(url, session, HttpMethod.Delete);
}

export async function createItem(item: Item, session?): Promise<Item> {
  const url = `${process.env.BACKEND_BASE_URL}/user/item`;
  const result = await request<Item>(url, session, HttpMethod.Post, item);
  return result.data;
}

export async function editItem(item: Item, session?): Promise<Item> {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/${item.uuid}`;
  const result = await request<Item>(url, session, HttpMethod.Patch, item);
  return result.data;
}

export async function getItemImageUuids(uuid, session?): Promise<[String]> {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}/image`;
  const result = await request<[String]>(url, session);
  return result.data;
}

export async function getItemImage(uuid, session?): Promise<Blob> {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/image/${uuid}`;
  const result = await request<Blob>(url, session, HttpMethod.Get, null, null, MimeType.octetStream);
  return result.data;
}

export async function uploadItemImage(uuid, data, session?) {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/${uuid}/image`;
  await request<String>(url, session, HttpMethod.Post, data, MimeType.formData, MimeType.textPlain);
}

export async function deleteItemImage(uuid, session?) {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/image/${uuid}`;
  await request<Item>(url, session, HttpMethod.Delete);
}