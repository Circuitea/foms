import { MapContainer, TileLayer, GeoJSON, Tooltip, LayersControl } from "react-leaflet";
import SanJuanBoundary from './sanjuan-boundary.json';
import { LegacyRef, PropsWithChildren, useState } from "react";
import PersonnelMarkersLayer from "./Partials/PersonnelMarkersLayer";
import 'leaflet/dist/leaflet.css';
import { Map } from "leaflet";
import ZoomControl from "./Partials/ZoomControl";
import BarangayBoundaries from "./Partials/BarangayBoundaries";

export default function TrackingMap({ ref } : {ref: LegacyRef<Map>}) {
    return (
        <MapContainer ref={ref} className='min-h-full h-full z-0' center={[14.6034363, 121.0389469]} zoom={15} scrollWheelZoom={false} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl />
            <GeoJSON
                style={{color: '#0000CC', weight: 4}}
                // @ts-ignore
                data={SanJuanBoundary}
                
            />

            <BarangayBoundaries />
            <PersonnelMarkersLayer />
        </MapContainer>
    );
}