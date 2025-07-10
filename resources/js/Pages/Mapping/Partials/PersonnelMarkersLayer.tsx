import { Personnel, PersonnelLocation, PersonnelMarkerDetails } from "@/types"
import { LayerGroup, Marker } from "react-leaflet"
import PersonnelMarker from "./PersonnelMarker"
import { useEcho } from "@laravel/echo-react";
import { useState } from "react";

// const personnelMarkers: PersonnelLocation[] = [
//     {
//         personnel: {
//             id: 1,
//             first_name: 'Charles Aaron',
//             surname: 'Sarmiento',
//             email: 'charlesaaron.sarmiento@example.com',
//             roles: [{id: 1, name: 'IT Staff'}],
//         },
//         latitude: 14.6074363,
//         longitude: 121.0299469,
//         created_at: '2025-07-30T12:34:00.000Z',
//         updated_at: '2025-07-30T12:34:00.000Z',
//     },
//     {
//         personnel: {
//             id: 2,
//             first_name: 'Victor',
//             surname: 'Chipe',
//             email: 'victor.chipe@example.com',
//             roles: [{id: 1, name: 'IT Staff'}],
//         },
//         latitude: 14.6032363    ,
//         longitude: 121.0499469,
//         created_at: '2025-07-30T12:34:00.000Z',
//         updated_at: '2025-07-30T12:34:00.000Z',
//     },
// ];


export default function PersonnelMarkersLayer({ isClickable = true }: { isClickable?: boolean }) {
    const [locations, setLocations] = useState<PersonnelLocation[]>([]);
    useEcho<{ personnelLocations: PersonnelLocation[] }>('location', 'LocationUpdated', ({ personnelLocations }) => {
        setLocations(personnelLocations);
    }); 

  return (
    <LayerGroup>
        {/* {personnelMarkers.map((personnelMarker) => <PersonnelMarker isClickable={isClickable} marker={personnelMarker} />)} */}
        {locations.map((location) => <PersonnelMarker isClickable={isClickable} marker={location} />)}
    </LayerGroup>
  )
}
