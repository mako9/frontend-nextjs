import { Community } from "../models/community";

const communities: Community[] = [
  {
    uuid: '95C87636-8320-4155-AEEF-1BA973C872CA',
    name: 'One',
    createdAt: '2020-01-02'
  },
  {
    uuid: '15C87636-8320-4155-AEEF-1BA973C872CA',
    name: 'Two',
    createdAt: '2020-01-03'
  }
];

export function getAllCommunityUuids() {
  return communities.map(community => {
    return {
      params: {
        id: community.uuid,
      },
    };
  });
}

export function getAllCommunities(): Community[] {
  return communities;
}

export async function getCommunity(uuid) {
  return communities.find(community => community.uuid === uuid);
}