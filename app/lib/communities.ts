import { Community } from "../models/community";
import { Page } from "../models/page";
import { request } from "../utils/request";

export async function getAllCommunities(context?): Promise<Page<Community>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community`;
  const result = await request<Page<Community>>(url, context);
  return result.data;
}

export async function getCommunity(uuid, context?): Promise<Community> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}`;
  const result = await request<Community>(url, context);
  return result.data;
}