import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import SanJuanBoundary from './sanjuan-boundary.json';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import PersonnelMarkersLayer from "./PersonnelMarkersLayer";
import 'leaflet/dist/leaflet.css';

export default function TrackingMap({ dragging = true}: { dragging: boolean }) {
    const [ isOpen, setOpen ] = useState(false);

    return (
        <div>
            <MapContainer className='min-h-full h-[16rem] z-0 border-2 border-dashed border-gray-300 rounded-lg' center={[14.6034363, 121.0389469]} zoom={14} scrollWheelZoom={false} dragging={dragging}>
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
        </div>
    );
}