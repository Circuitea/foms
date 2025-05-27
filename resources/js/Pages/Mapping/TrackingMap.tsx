import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import SanJuanBoundary from './sanjuan-boundary.json';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import PersonnelMarkersLayer from "./PersonnelMarkersLayer";

export default function TrackingMap() {
    const [ isOpen, setOpen ] = useState(false);

    return (
        <div>
            <MapContainer className='h-[75vh] z-0' center={[14.6044363, 121.0299469]} zoom={14} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON
                    style={{color: '#0000CC', weight: 7}}
                    // @ts-ignore
                    data={SanJuanBoundary}
                    
                />
                <PersonnelMarkersLayer />
            </MapContainer>
        </div>
    );
}