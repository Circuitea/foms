import { LayerGroup, Tooltip, GeoJSON, Marker } from "react-leaflet";
import { useMemo, useState } from "react";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import type { GeoJsonObject, Polygon } from "geojson";
import { Layers } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuItemIndicator } from "@radix-ui/react-dropdown-menu";

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

const colors = ['#1E90FF', '#FF4136', '#2ECC40', '#FF851B', '#B10DC9', '#FFDC00', '39CCCC'];

export default function BarangayBoundaries() {
    const { barangays } = usePage<PageProps<{ barangays: Barangay[] }>>().props;
    const [ isVisible, setVisible ] = useState(false);
    const [ isBarangayVisible, setBarangayVisible ]= useState(barangays.reduce<Record<number, boolean>>((col, barangay) => {
        col[barangay.osm_id] = true;
        return col;
    }, {}));

    const barangayToggleControl = (
        <div className="absolute top-4 right-0">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="w-12 h-12 bg-white border-gray-300 text-lg font-bold shadow-lg rounded-lg flex items-center justify-center">
                        <Layers className="w-7 h-7" />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                    <DropdownMenuLabel>Barangays Overlay</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={isVisible}
                        onCheckedChange={setVisible}
                        onSelect={(e) => e.preventDefault()}
                    >
                        {isVisible ? 'Disable' : 'Enable'}
                    </DropdownMenuCheckboxItem>
                    {isVisible && (
                        <div>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                {barangays.map((barangay) => (
                                    
                                    <DropdownMenuCheckboxItem
                                        checked={isBarangayVisible[barangay.osm_id]}
                                        onCheckedChange={(checked) => setBarangayVisible({...isBarangayVisible, [barangay.osm_id]: checked})}
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        Brgy. {barangay.name}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuGroup>
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    return (    
        <LayerGroup>
            <div className="leaflet-top leaflet-right">
                <div className="leaflet-control leaflet-bar">
                    {barangayToggleControl}
                </div>
            </div>
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