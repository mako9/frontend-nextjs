import { Item } from "../models/item";
import { Page } from "../models/page";
import { HttpMethod, request } from "../utils/request";

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

export async function editItem(item: Item, session?): Promise<Item> {
  const url = `${process.env.BACKEND_BASE_URL}/user/item/${item.uuid}`;
  const result = await request<Item>(url, session, HttpMethod.Patch, item);
  return result.data;
}