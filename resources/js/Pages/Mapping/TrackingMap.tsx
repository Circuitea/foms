import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import SanJuanBoundary from './sanjuan-boundary.json';
import { PropsWithChildren, useState } from "react";
import PersonnelMarkersLayer from "./PersonnelMarkersLayer";
import 'leaflet/dist/leaflet.css';

export default function TrackingMap({ children } : PropsWithChildren) {
    return (
        <MapContainer className='min-h-full h-full z-0' center={[14.6034363, 121.0389469]} zoom={14} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
                style={{color: '#0000CC', weight: 4}}
                // @ts-ignore
                data={SanJuanBoundary}
                
            />
            <PersonnelMarkersLayer />
        </MapContainer>
    );
}