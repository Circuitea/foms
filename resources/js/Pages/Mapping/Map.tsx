"use client"

import { useState, useEffect, useRef } from "react"
import { Users, EyeOff, MapIcon, ChevronRight, ChevronLeft, Eye } from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { JSX } from "react"
import TrackingMap from "./TrackingMap"
import { Map } from "leaflet"
import { useSidebar } from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { PageProps, Personnel, PersonnelLocation } from "@/types"
import { useEcho } from "@laravel/echo-react"
import { formatName } from "@/lib/utils"
import { GenerateLocationHistoryReportDialog } from "./Partials/GenerateLocationHistoryReportDialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function MapPage () {
  const { data } = usePage<PageProps<{ locations: { data: PersonnelLocation[] } }>>().props.locations;
  const [personnel, setPersonnel] = useState<Personnel[]>(data.map(location => location.personnel));
  useEcho<{ personnelLocations: PersonnelLocation[] }>('location', 'LocationUpdated', ({ personnelLocations }) => {
    setPersonnel(personnelLocations.map(location => location.personnel));
  });

  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>(data.map(location => location.personnel.id));

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { state } = useSidebar();

  const map = useRef<Map>(null);

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

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 min-w-0">
          <div className="w-full h-full bg-gray-100 relative overflow-hidden">
            <TrackingMap ref={map} selectedPersonnel={selectedPersonnel} />
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
                  className="sticky top-0 flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 shadow-sm border-2 border-blue-200 bg-blue-50 mb-4"
                >
                  <div className="w-12 h-12 bg-[#1B2560] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Active Personnel</div>
                    <div className="text-sm text-gray-600 font-medium">Count: {personnel.length}</div>
                  </div>
                  <GenerateLocationHistoryReportDialog />
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="flex justify-end gap-2 mb-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedPersonnel(personnel.map(person => person.id))}
                        >
                          <Eye className="h-3 w-3 text-[#1B2560]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Show All</TooltipContent>
                    </Tooltip>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedPersonnel([])}
                    >
                      <EyeOff className="h-3 w-3 text-[#1B2560]" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {personnel.map((person, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedPersonnel(selectedPersonnel.includes(person.id)
                            ? selectedPersonnel.filter(selectedPerson => selectedPerson !== person.id)
                            : [...selectedPersonnel, person.id]
                          );
                        }}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                          selectedPersonnel.includes(person.id)
                            ? "bg-blue-100 border border-blue-300"
                            : "bg-gray-50 border border-gray-200"
                          // "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{formatName(person)}</div>
                          <div className="text-xs text-gray-600">{person.email}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {selectedPersonnel.includes(person.id) ? (
                            <Eye className="h-3 w-3 text-[#1B2560]" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                        {/* {prioritizedUser?.id === person.id && (
                          <div className="ml-2 flex-shrink-0">
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
                className="w-6 h-16 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 hover:shadow-lg"
              >
                <ChevronRight className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          )}

          {!sidebarExpanded && (
            <div className="absolute top-1/2 transform -translate-y-1/2 -left-6">
              <button
                onClick={toggleSidebar}
                className="w-6 h-16 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 hover:shadow-lg"
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

