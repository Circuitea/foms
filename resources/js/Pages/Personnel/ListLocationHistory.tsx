import Authenticated from "@/Layouts/AuthenticatedLayout";
import { ReactElement, useState } from "react";
import { latLngBounds } from "leaflet";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import ZoomControl from "../Mapping/Partials/ZoomControl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { LocationMarker } from "./LocationMarker";

import 'leaflet/dist/leaflet.css';

const locationHistory = [
  { latitude: 14.595722, longitude: 121.028194, created_at: "2025-08-23T08:00:00Z" },
  { latitude: 14.596682, longitude: 121.029252, created_at: "2025-08-23T08:05:00Z" },
  { latitude: 14.597190, longitude: 121.028770, created_at: "2025-08-23T08:10:00Z" },
]

export default function ListLocationHistory() {
  const [openTooltips, setOpenTooltips] = useState<Record<number, boolean>>({});
  const bounds = latLngBounds(locationHistory.map(location => [location.latitude, location.longitude]));

  const changeTooltipState = (index: number, state: boolean) => {
    setOpenTooltips((prev) => ({
      ...prev,
      [index]: state,
    }));
  }

  return (
    <div className="grid grid-cols-[60%_40%] gap-2 h-full px-8 py-2">
      <div className="bg-white rounded-lg shadow border border-gray-200 h-full">
        <div className="px-6 py-4 border-b border-gray-200 h-full">
          <MapContainer
            className="h-full z-0"
            zoom={15}
            scrollWheelZoom={false}
            zoomControl={false}
            bounds={bounds}
          >
            <Polyline
              positions={locationHistory.map(location => [location.latitude, location.longitude])}
              pathOptions={{ color: 'red' }}
            />
            {locationHistory.map((location, i) => (
              <LocationMarker location={location} visible={!!openTooltips[i]} />
            ))}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl />
          </MapContainer>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">History</h3>
          <Popover>
            <PopoverTrigger className="rounded-lg py-1 px-2 border border-gray-200 flex gap-2 items-center justify-between">
              {dayjs().format("MMM DD, YYYY")}
              <ChevronDown className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                className="w-full"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="px-6 py-4 space-y-2">
          {locationHistory.map((location, i) => (
            <div
              onMouseOver={() => changeTooltipState(i, true)}
              onMouseOut={() => changeTooltipState(i, false)}
              className="border border-gray-200 shadow rounded-lg px-6 py-4 hover:bg-gray-50"
            >
              {dayjs(location.created_at).format("hh:mm A")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



ListLocationHistory.layout = (e: ReactElement) => {
  const { id } = e.props.personnel;

  return (
    <Authenticated
      children={e}
      pageTitle="Location History"
      breadcrumbEntries={[
        {
          value: 'Personnel Management',
          url: '/personnel',
        },
        {
          value: `Personnel (ID:${id})`,
          url: `/personnel/${id}`,
        },
        {
          value: 'Location History',
        },
      ]}
    />
  )
}