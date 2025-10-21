import { LayerGroup } from "react-leaflet"
import PersonnelMarker from "./PersonnelMarker"
import { PersonnelLocation } from "@/types"

export default function PersonnelMarkersLayer({ markerLocations, isClickable = true }: { markerLocations: Record<number, PersonnelLocation>, isClickable?: boolean }) {
  return (
    <LayerGroup>
      {Object.entries(markerLocations).map(([id, location]) => <PersonnelMarker key={id} isClickable={isClickable} marker={location} />)}
    </LayerGroup>
  )
}
