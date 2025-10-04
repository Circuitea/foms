import { icon, Marker as LeafletMarker } from "leaflet";
import { useEffect, useRef } from "react";
import MarkerIcon from './marker-generic.png';
import MarkerAvailable from './marker-available.png';
import MarkerAssigned from './marker-assigned.png';
import MarkerOnLeave from './marker-on-leave.png';
import MarkerEmergency from './marker-emergency.png';
import { Marker, Tooltip } from "react-leaflet";
import dayjs from "dayjs";
import { Personnel } from "@/types";

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

  const iconSize: [number, number] = [18, 18];
  const genericMarkerIcon = icon({
    iconUrl: MarkerIcon,
    iconSize,
  });

  const availableMarkerIcon = icon({
    iconUrl: MarkerAvailable,
    iconSize,
  });
  const assignedMarkerIcon = icon({
    iconUrl: MarkerAssigned,
    iconSize,
  });
  const onLeaveMarkerIcon = icon({
    iconUrl: MarkerOnLeave,
    iconSize,
  });
  const emergencyMarkerIcon = icon({
    iconUrl: MarkerEmergency,
    iconSize,
  });

  const hoveredMarkerIcon = icon({
    iconUrl: MarkerIcon,
    iconSize: [25, 25],
  });
  
  useEffect(() => {
    if (ref.current) {
      if (visible) {
        ref.current.openTooltip();
      } else {
        ref.current.closeTooltip();
      }
    }
  }, [visible]);

  const iconToUse = isGeneric
    ? ref.current?.isTooltipOpen() ? hoveredMarkerIcon : genericMarkerIcon
    : location.personnel?.status === 'assigned'
      ?  assignedMarkerIcon
      : location.personnel?.status === 'available'
        ? availableMarkerIcon
        : location.personnel?.status === 'on leave'
          ? onLeaveMarkerIcon
          : location.personnel?. status === 'emergency'
            ? emergencyMarkerIcon
            : genericMarkerIcon;

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
