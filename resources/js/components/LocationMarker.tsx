import { icon, Marker as LeafletMarker } from "leaflet";
import { useEffect, useRef } from "react";
import MarkerIcon from './marker-generic.png';
import MarkerAvailable from './marker-available.png';
import MarkerOnBreak from './marker-on-break.png';
import MarkerUnavailable from './marker-unavailable.png';
import MarkerEmergency from './marker-emergency.png';
import { Marker, Tooltip } from "react-leaflet";
import dayjs from "dayjs";
import { Personnel, Status } from "@/types";
import { cn, formatName, toProperCase } from "@/lib/utils";
import { User } from "lucide-react";

const iconSize: [number, number] = [25, 25];
const hoveredIconSize: [number, number] = [20, 20];

const getStatusColor = (status?: Status) => {
  if (!status) {
    return 'bg-gray-100 text-gray-800';
  }
  const colors: Record<Status, string> = {
    'available': "bg-green-100 text-green-800",
    'on break': "bg-orange-100 text-orange-800",
    'emergency': "bg-red-100 text-red-800",
    'unavailable': "bg-gray-200 text-gray-800",
  }
  return colors[status];
}

function getMarkerImage(status?: Status | 'generic', hovered = false) {
  const iconDetails = { iconSize: hovered ? hoveredIconSize : iconSize };
  switch (status) {
    case 'available':
      return icon({ ...iconDetails, iconUrl: MarkerAvailable });
    case 'on break':
      return icon({ ...iconDetails, iconUrl: MarkerOnBreak });
    case 'unavailable':
      return icon({ ...iconDetails, iconUrl: MarkerUnavailable });
    case 'emergency':
      return icon({ ...iconDetails, iconUrl: MarkerEmergency });
    case 'generic':
    default:
      return icon({ ...iconDetails, iconUrl: MarkerIcon });
  }
}

export function LocationMarker({
  location,
  visible = false,
  isGeneric = false,
  onClick,
  detailedTooltip = false,
} : {
  location: { personnel?: Personnel, location_name: string, latitude: number, longitude: number, created_at: string, updated_at?: string };
  visible: boolean;
  onClick?: () => void;
  isGeneric?: boolean;
  detailedTooltip?: boolean;
}) {
  const ref = useRef<LeafletMarker>(null);
  
  useEffect(() => {
    if (ref.current) {
      if (visible) {
        ref.current.openTooltip();
      } else {
        ref.current.closeTooltip();
      }
    }
  }, [visible]);

  const iconToUse = getMarkerImage(isGeneric ? 'generic' : location.personnel?.status, ref.current?.isTooltipOpen())

  return (
    <Marker
      ref={ref}
      position={[location.latitude, location.longitude]}
      icon={iconToUse}
      eventHandlers={{ click: onClick }}
    >
      <Tooltip className="min-w-sm">
        {detailedTooltip ? (
          <div className="grid grid-cols-4 grid-rows-2">
            <div className="row-span-2">
              <div className="flex justify-center items-center">
                {location.personnel?.profile_picture_filename ? (
                    <img className="rounded-full w-12 h-12" src={`storage/${location.personnel.profile_picture_filename}`} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center leading-none">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600 block -translate-y-px translate-x-px" />
                      </div>
                    </div>
                )}
              </div>
            </div>
            <div className="col-span-3 flex justify-between">
              <p className="font-bold">{location.personnel ? formatName(location.personnel) : 'Person'}</p>
              <span className={cn("inline-flex px-2 py-1 text-xs font-semibold rounded-full", getStatusColor(location.personnel?.status))}>{toProperCase(location.personnel?.status ?? 'unavailable')}</span>
            </div>
            <div className="self-end col-span-3 flex justify-between">
              <p>{location.location_name}</p>
              <span className="inline-flex px-2">{dayjs(location.updated_at ?? location.created_at).format("hh:mm A")}</span>
            </div>
          </div>
        ) : `${location.location_name} - ${dayjs(location.updated_at ?? location.created_at).format("hh:mm A")}`}
      </Tooltip>
    </Marker>
  )
}
