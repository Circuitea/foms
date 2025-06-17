import { LayerGroup, Tooltip, GeoJSON, Marker } from "react-leaflet";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import type { GeoJsonObject, Polygon } from "geojson";

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

interface Barangay {
    osm_id: number,
    name: string,
    geojson: GeoJsonObject & Polygon;
}

const colors = ['#33A1FF', '#28B463', '#F1C40F', '#9B59B6', '#E74C3C'];

export default function BarangayBoundaries() {
    const { barangays } = usePage<PageProps<{ barangays: Barangay[] }>>().props;
    const [ isVisible, setVisible ] = useState(true);
    const [ isBarangayVisible, setBarangayVisible ]= useState(barangays.reduce<Record<number, boolean>>((col, barangay) => {
        col[barangay.osm_id] = true;
        return col;
    }, {}));

    // const barangaysVisible: Record<Barangay['id'], boolean> = {};
    // barangays.forEach((barangay) => barangaysVisible[barangay.id] = true);
    // setBarangayVisible(barangaysVisible);

    return (    
        <LayerGroup>
            
            {isVisible && barangays.map((barangay, i) => {
                if (isBarangayVisible[barangay.osm_id]) {
                    return (
                        <GeoJSON
                            data={barangay.geojson}
                            style={{fillOpacity: 0.3, weight: 4, color: '#0000CC', fillColor: colors[i % colors.length]}}
                        >
                            <Tooltip sticky>Brgy. {barangay.name}</Tooltip>
                        </GeoJSON>
                    );
                }
            })}
        </LayerGroup>
    );
}