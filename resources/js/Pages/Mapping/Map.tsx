"use client"

import { useState, useEffect, useRef, LegacyRef } from "react"
import { Users, Eye, EyeOff, ChevronUp, ChevronDown, Monitor, MapIcon, ChevronRight, ChevronLeft, FileText } from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { JSX } from "react"
import TrackingMap from "./TrackingMap"
import { Map } from "leaflet"
import { useSidebar } from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { PageProps, Personnel, PersonnelLocation } from "@/types"
import { useEcho } from "@laravel/echo-react"
import { formatName } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { GenerateLocationHistoryReportDialog } from "./Partials/GenerateLocationHistoryReportDialog"

export default function MapPage () {
  const { data } = usePage<PageProps<{ locations: { data: PersonnelLocation[] } }>>().props.locations;
  const [personnel, setPersonnel] = useState<Personnel[]>(data.map(location => location.personnel));
  useEcho<{ personnelLocations: PersonnelLocation[] }>('location', 'LocationUpdated', ({ personnelLocations }) => {
    setPersonnel(personnelLocations.map(location => location.personnel));
  });

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
            <TrackingMap ref={map} />
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
                  <div className="space-y-2">
                    {personnel.map((person, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                          // prioritizedUser?.id === person.id
                          //   ? "bg-blue-100 border border-blue-300"
                          //   : "bg-gray-50 border border-gray-200"
                          "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{formatName(person)}</div>
                          <div className="text-xs text-gray-600">{person.email}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              person.status === "assigned" ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></div>
                          {/* {prioritizedUser?.id === person.id ? ( */}
                            {/* <Eye className="h-3 w-3 text-[#1B2560]" /> */}
                          {/* ) : ( */}
                            <EyeOff className="h-3 w-3 text-gray-400" />
                          {/* )} */}
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
          
          {/* <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Content Area
            <div
              className={`flex-1 overflow-y-auto transition-opacity duration-300 scroll-smooth ${sidebarExpanded ? "opacity-100" : "opacity-0"}`}
            >
              <div className="p-6">
                {!selectedCategory ? (
                  // Show all categories when none is selected
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">Sections</h2>
                      <p className="text-sm text-gray-500">Select a section to view personnel</p>
                    </div>

                    {(Object.keys(personnelData) as Category[]).map((category) => (
                      <div
                        key={category}
                        className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50 shadow-sm border border-gray-200"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="w-12 h-12 bg-[#1B2560] rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{category}</div>
                          <div className="text-sm text-gray-600 font-medium">{getCategoryCount(category)}</div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      </div>
                    ))}

                    <div className="flex items-center justify-center p-8 mt-20">
                      <div className="text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-medium text-gray-700">Select a Category</p>
                        <p className="text-sm mt-1">Choose a category above to view personnel</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div
                      className="sticky top-0 z-20 flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50 shadow-sm border-2 border-blue-200 bg-blue-50 mb-4"
                      onClick={() => handleCategoryClick(selectedCategory)}
                    >
                      <div className="w-12 h-12 bg-[#1B2560] rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{selectedCategory}</div>
                        <div className="text-sm text-gray-600 font-medium">{getCategoryCount(selectedCategory)}</div>
                      </div>
                      <ChevronUp className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    </div>

                    {/* Scrollable Personnel List
                    <div className="flex-1 overflow-y-auto">
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 mb-4 px-2">
                          Click on a person to prioritize their location on the map
                        </div>
                        {personnelData[selectedCategory].map((person) => (
                          <div
                            key={person.id}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                              prioritizedUser?.id === person.id
                                ? "bg-blue-100 border border-blue-300"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                            onClick={() => handleUserClick(person)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-sm">{person.name}</div>
                              <div className="text-xs text-gray-600">{person.position}</div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  person.status === "active" ? "bg-green-500" : "bg-gray-400"
                                }`}
                              ></div>
                              {prioritizedUser?.id === person.id ? (
                                <Eye className="h-3 w-3 text-[#1B2560]" />
                              ) : (
                                <EyeOff className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                            {prioritizedUser?.id === person.id && (
                              <div className="ml-2 flex-shrink-0">
                                <div className="text-xs text-[#1B2560] bg-blue-200 px-2 py-1 rounded">📍</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fixed Bottom Instructions
              {selectedCategory && (
                <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-blue-50">
                  <div className="text-sm text-[#1B2560]">
                    <strong>{selectedCategory}</strong> personnel are now visible on the map.
                    {prioritizedUser && (
                      <div className="mt-1 text-[#1B2560]">
                        Currently focused on: <strong>{prioritizedUser.name}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div> */}

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

