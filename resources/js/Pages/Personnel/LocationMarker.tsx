import { icon, Marker as LeafletMarker } from "leaflet";
import { useEffect, useRef } from "react";
import MarkerIcon from './marker-icon.png';
import { Marker, Tooltip } from "react-leaflet";
import dayjs from "dayjs";

export function LocationMarker({
  location,
  visible = false,
} : {
  location: { latitude: number, longitude: number, created_at: string },
  visible: boolean
}) {
  const ref = useRef<LeafletMarker>(null);
  const markerIcon = icon({
    iconUrl: MarkerIcon,
    iconSize: [15, 15],
  });
  const hoveredMarkerIcon = icon({
    iconUrl: MarkerIcon,
    iconSize: [20, 20],
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

  return (
    <Marker
      ref={ref}
      position={[location.latitude, location.longitude]}
      icon={visible || ref.current?.isTooltipOpen() ? hoveredMarkerIcon : markerIcon}
    >
      <Tooltip>
        Location - {dayjs(location.created_at).format("hh:mm A")}
      </Tooltip>
    </Marker>
  )
}
