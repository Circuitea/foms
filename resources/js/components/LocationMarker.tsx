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

const iconSize: [number, number] = [25, 25];
const hoveredIconSize: [number, number] = [20, 20];


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
  onClick
} : {
  location: { personnel?: Personnel, location_name: string, latitude: number, longitude: number, created_at: string, updated_at?: string };
  visible: boolean;
  onClick?: () => void;
  isGeneric?: boolean;
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
      <Tooltip>
        {location.location_name} - {dayjs(location.updated_at ?? location.created_at).format("hh:mm A")}
      </Tooltip>
    </Marker>
  )
}
