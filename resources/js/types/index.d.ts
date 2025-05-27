import { LatLngExpression, LatLngTuple } from "leaflet";

export interface Personnel {
    id: number;
    first_name: string;
    middle_name?: string;
    surname: string;
    name_extension?: string;
    email: string;
    mobile_number?: string;
    roles: Role[],
}

export interface Role {
    id: number;
    name: string;
}

export interface PersonnelMarkerDetails {
    personnel: Personnel,
    position: LatLngTuple,
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: Personnel;
    };
};
