import { Community } from "../models/community";
import { Item } from "../models/item";
import { Page } from "../models/page";
import { User } from "../models/user";
import { HttpMethod, request } from "../utils/request";

export async function getAllCommunities(context?): Promise<Page<Community>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community`;
  const result = await request<Page<Community>>(url, context);
  return result.data;
}

export async function getOwnedCommunities(session?): Promise<Page<Community>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/owned`;
  const result = await request<Page<Community>>(url, session);
  return result.data;
}

export async function getMyCommunities(session?): Promise<Page<Community>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/my`;
  const result = await request<Page<Community>>(url, session);
  return result.data;
}

export async function getCommunity(uuid, session?): Promise<Community> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}`;
  const result = await request<Community>(url, session);
  return result.data;
}

export async function createCommunity(community: Community, session?): Promise<Community> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community`;
  const result = await request<Community>(url, session, HttpMethod.Post, community);
  return result.data;
}

export async function editCommunity(community: Community, session?): Promise<Community> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${community.uuid}`;
  const result = await request<Community>(url, session, HttpMethod.Patch, community);
  return result.data;
}

export async function deleteCommunity(uuid, session?): Promise<Community> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}`;
  const result = await request<Community>(url, session, HttpMethod.Delete);
  return result.data;
}

export async function getItemsOfCommunity(uuid, session?): Promise<Page<Item>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}/item`;
  const result = await request<Page<Item>>(url, session);
  return result.data;
}

export async function getMemberOfCommunity(uuid, session?): Promise<Page<User>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}/member`;
  const result = await request<Page<User>>(url, session);
  return result.data;
}

export async function getReguestingMemberOfCommunity(uuid, session?): Promise<Page<User>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}/requesting-member`;
  const result = await request<Page<User>>(url, session);
  return result.data;
}

export async function approveMemberRequests(uuid, userUuids, session?): Promise<Page<User>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}/request/approve`;
  const result = await request<Page<User>>(url, session, HttpMethod.Post, userUuids);
  return result.data;
}

export async function declineMemberRequests(uuid, userUuids, session?): Promise<Page<User>> {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}/request/decline`;
  const result = await request<Page<User>>(url, session, HttpMethod.Post, userUuids);
  return result.data;
}

export async function joinCommunity(uuid, session?) {
  const url = `${process.env.BACKEND_BASE_URL}/user/community/${uuid}/join`;
  await request(url, session);
}