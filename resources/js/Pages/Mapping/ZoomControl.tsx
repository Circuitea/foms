import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { useMemo } from "react";
import { useMap } from "react-leaflet";

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

type POSITIONS = keyof typeof POSITION_CLASSES;

export default function ZoomControl({ position = 'bottomright' }: { position?: POSITIONS }) {
    const map = useMap();

    const zoomControl = useMemo(() => (
        <div className="absolute bottom-4 right-0 flex flex-col gap-1 items-center">
            {/* Zoom In Button - Bigger and closer */}
            <Button
            variant="outline"
            size="sm"
            className="w-12 h-12 bg-white border-gray-300 hover:bg-gray-50 text-lg font-bold flex items-center justify-center shadow-lg rounded-lg"
            onClick={() => map.zoomIn()}
            >
            +
            </Button>

            {/* Zoom Out Button - Bigger and closer */}
            <Button
            variant="outline"
            size="sm"
            className="w-12 h-12 bg-white border-gray-300 hover:bg-gray-50 text-lg font-bold flex items-center justify-center shadow-lg rounded-lg"
            onClick={() => map.zoomOut()}
            >
            -
            </Button>

            {/* Export Button - with gap */}
            <div className="group relative mt-2">
            <Button
                variant="outline"
                size="sm"
                className="w-12 h-12 bg-white border-gray-300 hover:bg-gray-50 group-hover:opacity-0 transition-opacity duration-200 flex items-center justify-center shadow-lg rounded-lg"
            >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6ZM6 4H13V9H18V20H6V4ZM8 12H16V14H8V12ZM8 16H13V18H8V16Z" />
                </svg>
            </Button>

            {/* Expanded Export Button on Hover */}
            <Button
                variant="outline"
                className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white border-gray-300 hover:bg-gray-50 px-4 py-2 h-12 whitespace-nowrap transform -translate-x-[calc(100%-3rem)] flex items-center justify-center shadow-lg rounded-lg"
                asChild
            >
                <Link href="/map/report">Export Report</Link>
            </Button>
            </div>
        </div>
    ), []);

    const positionClass = POSITION_CLASSES[position];

    return (
        <div className={positionClass}>
            <div className="leaflet-control leaflet-bar">{zoomControl}</div>
        </div>
    );
}
