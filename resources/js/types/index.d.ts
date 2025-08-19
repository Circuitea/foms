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
    sections: Section[],
    status: Status | null,
}

export type Status = 'available' | 'assigned' | 'on_leave';

export interface Role {
    id: number;
    name: string;
    label: string;
}

export interface PersonnelMarkerDetails {
    personnel: Personnel,
    position: LatLngTuple,
    recentLocations?: {
        location: string,
        time: Date,
    }[],
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: Personnel;
        permissions: string[],
        profilePicture: string,
    };
};

export interface PersonnelLocation {
    personnel: Personnel,
    latitude: number,
    longitude: number,
    created_at: string,
    updated_at: string,
};

export interface Section {
    id: number,
    name: string,
    manager?: Personnel,
}