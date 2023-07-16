export type Item = {
    uuid: string;
    name: string;
    categories: Array<string>;
    street:  string;
    houseNumber: string;
    postalCode: string;
    city: string;
    communityUuid: string;
    userUuid: string;
    active: boolean;
    availability: string;
    availableUntil: string;
    description: string;
    communityName: string;
    firstImageUuid: string;
};