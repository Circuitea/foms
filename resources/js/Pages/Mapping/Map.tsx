"use client"

import { useState, useEffect, useRef } from "react"
import { Users, EyeOff, MapIcon, ChevronRight, ChevronLeft, Eye, CircleCheck, Coffee, AlarmClockOff, ShieldAlert } from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { JSX } from "react"
import TrackingMap from "./TrackingMap"
import { Map } from "leaflet"
import { useSidebar } from "@/components/ui/sidebar"
import { formatName, userHasPermission } from "@/lib/utils"
import { GenerateLocationHistoryReportDialog } from "./Partials/GenerateLocationHistoryReportDialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import { ALL_STATUSES, useMapTracking } from "@/hooks/use-map-tracking"
import { Status } from "@/types"

export default function MapPage () {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { state } = useSidebar();
  const map = useRef<Map>(null);
  const { locations, personnel, selectedStatuses, visiblePersonnel, togglePersonnelHide, setSelectedStatuses } = useMapTracking();
  
  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  // Force map resize when sidebar state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger window resize event to force map libraries to recalculate
      window.dispatchEvent(new Event("resize"))

      // If you have access to the map instance, you can also call map.invalidateSize() here
      // This is for Leaflet specifically - adjust based on your mapping library
      if (map.current && typeof map.current.invalidateSize === "function") {
        map.current.invalidateSize();
      }
    }, 350) // Wait for sidebar animation to complete

    return () => clearTimeout(timer)
  }, [sidebarExpanded, state])

  const allSelected = ALL_STATUSES.every(status => selectedStatuses.includes(status));

  const statusSelectionOptions = [
    {value: 'available', icon: CircleCheck},
    {value: 'on break', icon: Coffee},
    {value: 'unavailable', icon: AlarmClockOff},
    {value: 'emergency', icon: ShieldAlert},

  ]

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 min-w-0">
          <div className="w-full h-full bg-gray-100 relative overflow-hidden">
            <TrackingMap markerLocations={locations} ref={map} />
          </div>
        </div>

        <div
          className={`bg-white border-l border-gray-200 flex transition-all duration-300 ease-in-out relative ${
            sidebarExpanded ? "w-80 rounded-l-xl" : "w-2"
          }`}
        >
          <div className="p-6 w-full">
            <div className="flex flex-col overflow-y-auto scroll-smooth">
              <div className="h-full flex flex-col w-full">
                <div
                  className="sticky top-0 flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 shadow-xs border-2 border-blue-200 bg-blue-50 mb-4"
                >
                  <div className="w-12 h-12 bg-[#1B2560] rounded-full flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Active Personnel</div>
                    <div className="text-sm text-gray-600 font-medium">Count: {personnel.length}</div>
                  </div>
                  {userHasPermission(/history\.read/) && (
                    <GenerateLocationHistoryReportDialog />
                  )}
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="flex justify-end gap-2 mb-2">
                    {/* <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setHiddenPersonnel([])}
                        >
                          <Eye className="h-3 w-3 text-[#1B2560]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Show All</TooltipContent>
                    </Tooltip>
                    <Button
                      variant="outline"
                      onClick={() => setHiddenPersonnel(personnel.map(person => person.id))}
                    >
                      <EyeOff className="h-3 w-3 text-[#1B2560]" />
                    </Button> */}
                    <Toggle variant="outline" pressed={allSelected} onPressedChange={() => {
                      if (allSelected) {
                        setSelectedStatuses([]);
                      } else {
                        setSelectedStatuses([...ALL_STATUSES]);
                      }
                    }}><Eye /></Toggle>
                    <ToggleGroup type="multiple" variant="outline" value={selectedStatuses} onValueChange={(value) => {
                      setSelectedStatuses(value as Status[]);
                    }}>
                      {statusSelectionOptions.map((option, index) => (
                        <ToggleGroupItem key={index} value={option.value}><option.icon /></ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                  <div className="space-y-2">
                    {personnel.filter(person => selectedStatuses.includes(person.status)).map((person, index) => (
                      <div
                        key={index}
                        onClick={() => togglePersonnelHide(person.id)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                          !!visiblePersonnel.find(visiblePerson => visiblePerson.id === person.id)
                            ? "bg-blue-100 border border-blue-300"
                            : "bg-gray-50 border border-gray-200"
                          // "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{formatName(person)}</div>
                          <div className="text-xs text-gray-600">{person.email}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!!visiblePersonnel.find(visiblePerson => visiblePerson.id === person.id) ? (
                            <Eye className="h-3 w-3 text-[#1B2560]" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                        {/* {prioritizedUser?.id === person.id && (
                          <div className="ml-2 shrink-0">
                            <div className="text-xs text-[#1B2560] bg-blue-200 px-2 py-1 rounded">📍</div>
                          </div>
                        )} */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>              
            </div>
          </div>

          {sidebarExpanded && (
            <div className="absolute top-1/2 transform -translate-y-1/2 -left-6">
              <button
                onClick={toggleSidebar}
                className="w-6 h-16 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 hover:shadow-lg"
              >
                <ChevronRight className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          )}

          {!sidebarExpanded && (
            <div className="absolute top-1/2 transform -translate-y-1/2 -left-6">
              <button
                onClick={toggleSidebar}
                className="w-6 h-16 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 hover:shadow-lg"
              >
                <ChevronLeft className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

MapPage.layout = (e: JSX.Element) => <Authenticated PageIcon={MapIcon} pageTitle="Tracking Map" children={e} />

