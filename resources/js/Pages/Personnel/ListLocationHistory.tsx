import Authenticated from "@/Layouts/AuthenticatedLayout";
import { ReactElement, useEffect, useState } from "react";
import { latLngBounds } from "leaflet";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import ZoomControl from "../Mapping/Partials/ZoomControl";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import dayjs from "dayjs";
import { ChevronDown } from "lucide-react";
import { LocationMarker } from "./LocationMarker";

import 'leaflet/dist/leaflet.css';
import { PageProps, Personnel } from "@/types";
import { router } from "@inertiajs/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {  DayButton, DayButtonProps } from "react-day-picker";

interface Location {
  latitude: number;
  longitude: number;
  location_name: string;
  created_at: string;
}

interface AvailableDate {
  date: string;
  count: number;
}

export default function Listlocation_history({ location_history, personnel, selected_date, available_dates }: PageProps<{
  location_history: Location[],
  personnel: Personnel,
  selected_date: string,
  available_dates: AvailableDate[],
}>) {
  const [date, setDate] = useState<Date>(dayjs(selected_date, "YYYY-M-D").toDate());
  const [openTooltips, setOpenTooltips] = useState<Record<number, boolean>>({});
  const bounds = location_history.length > 0
    ? latLngBounds(location_history.map(location => [location.latitude, location.longitude]))
    : latLngBounds([[14.6049536202617, 121.02954192937848]]);

  const changeTooltipState = (index: number, state: boolean) => {
    setOpenTooltips((prev) => ({
      ...prev,
      [index]: state,
    }));
  }

  return (
    <div className="grid grid-cols-[60%_40%] gap-2 px-8 py-2">
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
              positions={location_history.map(location => [location.latitude, location.longitude])}
              pathOptions={{ color: 'red' }}
            />
            {location_history.map((location, i) => (
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
              {dayjs(date).format("MMM DD, YYYY")}
              <ChevronDown className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                required
                disabled={(dateToDisable) => {
                  const checkDate = dayjs(dateToDisable).format('YYYY-MM-DD');
                  if (available_dates.find(available_date => available_date.date !== checkDate)) {
                    console.log(true);
                    return true;
                  } else return false;
                }}
                className="w-full"
                selected={date}
                defaultMonth={date}
                onSelect={(newDate) => {
                  const {years, months, date} = dayjs(newDate).toObject();

                  console.log(`years: ${years} | months: ${months+1} | $date: ${date}`);

                  router.visit(`/personnel/${personnel.id}/location-history/${years}-${months+1}-${date}`);
                }}
                mode="single"
                components={{
                  DayButton: ({ day, modifiers, ...buttonProps }: DayButtonProps) => {
                    const dayCount = available_dates.find(available_date => available_date.date === dayjs(day.date).format('YYYY-MM-DD'))?.count;

                    return dayCount ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <CalendarDayButton
                            day={day}
                            modifiers={modifiers}
                            {...buttonProps}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          Recorded Locations: {dayCount}
                        </TooltipContent>
                      </Tooltip>
                    ) : <CalendarDayButton
                          day={day}
                          modifiers={modifiers}
                          {...buttonProps}
                        />;
                  },
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="px-6 py-4 space-y-2 h-screen overflow-y-auto">
          {location_history.map((location, i) => (
            <div
              onMouseOver={() => changeTooltipState(i, true)}
              onMouseOut={() => changeTooltipState(i, false)}
              className="border border-gray-200 shadow rounded-lg px-6 py-4 hover:bg-gray-50 flex justify-between items-center"
            >
              <span className="text-sm">{location.location_name}</span>
              <span className="text-xs text-gray-500">{dayjs(location.created_at).format("hh:mm A")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



Listlocation_history.layout = (e: ReactElement) => {
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