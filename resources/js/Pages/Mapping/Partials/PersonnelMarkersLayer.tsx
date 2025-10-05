import { LayerGroup } from "react-leaflet"
import PersonnelMarker from "./PersonnelMarker"
import { PersonnelLocation } from "@/types"

export default function PersonnelMarkersLayer({ markerLocations, isClickable = true, hiddenPersonnel }: { markerLocations: Record<number, PersonnelLocation>, isClickable?: boolean, hiddenPersonnel: number[] }) {
  return (
    <LayerGroup>
      {Object.entries(markerLocations).map(([id, location]) => <PersonnelMarker key={id} isClickable={isClickable} marker={location} selected={!hiddenPersonnel.includes(location.personnel.id)} />)}
    </LayerGroup>
  )
}
