import { LatLngExpression, LatLngTuple } from "leaflet";

export interface Personnel {
    id: number;
    first_name: string;
    middle_name?: string;
    surname: string;
    name_extension?: string;
    email: string;
    mobile_number?: string;
    roles: Role[];
    sections: Section[];
    status: Status;
    position?: string;
    profile_picture_filename: string | null;
}

export type Status = 'available' | 'unavailable' | 'emergency' | 'on break';

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
    id: number;
    personnel: Personnel & {
        location_history: Location[];
    },
    latitude: number,
    longitude: number,
    created_at: string,
    updated_at: string,
    location_name: string;
};

export interface Section {
    id: number,
    name: string,
    manager?: Personnel,
}

export interface Location {
  latitude: number;
  longitude: number;
  location_name: string;
  created_at: string;
}
