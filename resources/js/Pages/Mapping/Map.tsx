"use client"

import { useState, useEffect, useRef, LegacyRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Eye, EyeOff, ChevronUp, ChevronDown, Monitor } from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { JSX } from "react"
import TrackingMap from "./TrackingMap"
import { Link } from "@inertiajs/react"
import { Map } from "leaflet"

// Mock data for personnel
const personnelData = {
  Management: [
    { id: 1, name: "John Smith", position: "Manager", lat: 14.5995, lng: 120.9842, status: "active" },
    { id: 2, name: "Sarah Johnson", position: "Director", lat: 14.6042, lng: 120.9822, status: "active" },
    { id: 3, name: "Mike Chen", position: "Supervisor", lat: 14.5985, lng: 120.9862, status: "inactive" },
    { id: 4, name: "Lisa Wong", position: "Team Lead", lat: 14.6012, lng: 120.9835, status: "active" },
    { id: 5, name: "David Brown", position: "Manager", lat: 14.5978, lng: 120.9855, status: "active" },
    { id: 6, name: "Emma Davis", position: "Director", lat: 14.6025, lng: 120.9845, status: "active" },
    { id: 7, name: "James Wilson", position: "Supervisor", lat: 14.5992, lng: 120.9838, status: "active" },
    { id: 8, name: "Anna Garcia", position: "Team Lead", lat: 14.6008, lng: 120.9852, status: "inactive" },
    { id: 9, name: "Robert Lee", position: "Manager", lat: 14.5988, lng: 120.9848, status: "active" },
    { id: 10, name: "Maria Rodriguez", position: "Director", lat: 14.6018, lng: 120.9832, status: "active" },
    { id: 11, name: "Kevin Taylor", position: "Supervisor", lat: 14.5982, lng: 120.9858, status: "active" },
    { id: 12, name: "Jennifer Martinez", position: "Team Lead", lat: 14.6005, lng: 120.9842, status: "active" },
  ],
  Monitoring: [
    { id: 13, name: "Alex Thompson", position: "Monitor", lat: 14.6015, lng: 120.9825, status: "active" },
    { id: 14, name: "Rachel Green", position: "Observer", lat: 14.5975, lng: 120.9865, status: "active" },
    { id: 15, name: "Tom Anderson", position: "Watcher", lat: 14.6035, lng: 120.9815, status: "inactive" },
    { id: 16, name: "Sophie Miller", position: "Monitor", lat: 14.5965, lng: 120.9875, status: "active" },
    { id: 17, name: "Chris Evans", position: "Observer", lat: 14.6022, lng: 120.9828, status: "active" },
    { id: 18, name: "Nina Patel", position: "Watcher", lat: 14.5998, lng: 120.9845, status: "active" },
    { id: 19, name: "Mark Johnson", position: "Monitor", lat: 14.6008, lng: 120.9838, status: "active" },
    { id: 20, name: "Laura Kim", position: "Observer", lat: 14.5985, lng: 120.9855, status: "inactive" },
  ],
  Planning: [
    { id: 21, name: "Daniel White", position: "Planner", lat: 14.6028, lng: 120.9822, status: "active" },
    { id: 22, name: "Grace Liu", position: "Strategist", lat: 14.5972, lng: 120.9868, status: "active" },
    { id: 23, name: "Ryan Murphy", position: "Coordinator", lat: 14.6038, lng: 120.9812, status: "active" },
    { id: 24, name: "Olivia Brown", position: "Planner", lat: 14.5968, lng: 120.9872, status: "inactive" },
    { id: 25, name: "Nathan Clark", position: "Strategist", lat: 14.6025, lng: 120.9825, status: "active" },
    { id: 26, name: "Zoe Adams", position: "Coordinator", lat: 14.5995, lng: 120.9848, status: "active" },
    { id: 27, name: "Lucas Turner", position: "Planner", lat: 14.6012, lng: 120.9835, status: "active" },
    { id: 28, name: "Mia Foster", position: "Strategist", lat: 14.5988, lng: 120.9852, status: "active" },
    { id: 29, name: "Ethan Cooper", position: "Coordinator", lat: 14.6018, lng: 120.9828, status: "inactive" },
    { id: 30, name: "Chloe Reed", position: "Planner", lat: 14.5982, lng: 120.9858, status: "active" },
  ],
  Others: [
    { id: 31, name: "Jake Wilson", position: "Support", lat: 14.6032, lng: 120.9818, status: "active" },
    { id: 32, name: "Amy Chen", position: "Assistant", lat: 14.5975, lng: 120.9865, status: "active" },
    { id: 33, name: "Ben Taylor", position: "Intern", lat: 14.6042, lng: 120.9808, status: "active" },
    { id: 34, name: "Lily Wang", position: "Support", lat: 14.5962, lng: 120.9878, status: "inactive" },
    { id: 35, name: "Sam Davis", position: "Assistant", lat: 14.6028, lng: 120.9822, status: "active" },
    { id: 36, name: "Ruby Martinez", position: "Intern", lat: 14.5998, lng: 120.9845, status: "active" },
    { id: 37, name: "Max Johnson", position: "Support", lat: 14.6015, lng: 120.9832, status: "active" },
    { id: 38, name: "Ivy Lee", position: "Assistant", lat: 14.5985, lng: 120.9855, status: "active" },
    { id: 39, name: "Leo Garcia", position: "Intern", lat: 14.6022, lng: 120.9825, status: "inactive" },
    { id: 40, name: "Rose Kim", position: "Support", lat: 14.5992, lng: 120.9848, status: "active" },
    { id: 41, name: "Jack Brown", position: "Assistant", lat: 14.6008, lng: 120.9838, status: "active" },
    { id: 42, name: "Ella White", position: "Intern", lat: 14.5978, lng: 120.9862, status: "active" },
    { id: 43, name: "Noah Miller", position: "Support", lat: 14.6025, lng: 120.9828, status: "active" },
    { id: 44, name: "Ava Thompson", position: "Assistant", lat: 14.5988, lng: 120.9852, status: "inactive" },
    { id: 45, name: "Owen Anderson", position: "Intern", lat: 14.6012, lng: 120.9835, status: "active" },
  ],
}

type Category = keyof typeof personnelData
type Personnel = (typeof personnelData)[Category][0]

function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [prioritizedUser, setPrioritizedUser] = useState<Personnel | null>(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const map = useRef<Map>(null);

  const handleCategoryClick = (category: Category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
      setPrioritizedUser(null)
    } else {
      setSelectedCategory(category)
      setPrioritizedUser(null)
    }
  }

  const handleUserClick = (user: Personnel) => {
    setPrioritizedUser(user)
  }

  const getCategoryCount = (category: Category) => {
    return personnelData[category].length
  }

  const getActiveCount = (category: Category) => {
    return personnelData[category].filter((p) => p.status === "active").length
  }

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
  }, [sidebarExpanded])

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Header - Navy Blue Theme */}
      <div className="bg-[#1B2560] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200 group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="w-px h-6 bg-white/20"></div>
          <h1 className="text-2xl font-bold text-white">PERSONNEL TRACKING</h1>
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">LIVE</Badge>
        </div>

        {/* Right side - Presentation View Button */}
        <div className="flex items-center">
          <Link
            href="/map/presentation"
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg transition-all duration-200 group border border-white/20 hover:border-white/30 shadow-sm"
          >
            <Monitor className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">Presentation View</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Map Area - Flexible Width */}
        <div className="flex-1 min-w-0">
          {/* Map Container */}
          <div className="w-full h-full bg-gray-100 relative overflow-hidden">
            {/* Map Placeholder - In real implementation, use Leaflet, Google Maps, etc. */}
            <TrackingMap ref={map} />

            {/* Map Controls - Bottom Right - Floating and Separate - Moved higher
            <div className="absolute bottom-16 right-4 flex flex-col gap-1 items-center">
              {/* Zoom In Button - Bigger and closer *
              <Button
                variant="outline"
                size="sm"
                className="w-12 h-12 bg-white border-gray-300 hover:bg-gray-50 text-lg font-bold flex items-center justify-center shadow-lg rounded-lg"
                onClick={() => map.current.zoomIn()}
              >
                +
              </Button>

              {/* Zoom Out Button - Bigger and closer *
              <Button
                variant="outline"
                size="sm"
                className="w-12 h-12 bg-white border-gray-300 hover:bg-gray-50 text-lg font-bold flex items-center justify-center shadow-lg rounded-lg"
                onClick={() => map.current.zoomOut()}
              >
                -
              </Button>

              {/* Export Button - with gap *
              <div className="group relative mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-12 h-12 bg-white border-gray-300 hover:bg-gray-50 group-hover:opacity-0 transition-opacity duration-200 flex items-center justify-center shadow-lg rounded-lg"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6ZM6 4H13V9H18V20H6V4ZM8 12H16V14H8V12ZM8 16H13V18H8V16Z" />
                  </svg>
                </Button>

                {/* Expanded Export Button on Hover *
                <Button
                  variant="outline"
                  className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white border-gray-300 hover:bg-gray-50 px-4 py-2 h-12 whitespace-nowrap transform -translate-x-[calc(100%-3rem)] flex items-center justify-center shadow-lg rounded-lg"
                  asChild
                >
                  <Link href="/map/report">Export Report</Link>
                </Button>
              </div>
            </div> */}

            {/* Legend */}
            {selectedCategory && (
              <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                <h3 className="font-medium text-gray-900 mb-2">Legend</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Active Personnel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600">Inactive Personnel</span>
                  </div>
                  {prioritizedUser && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600">Prioritized</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Expandable with Rounded Edges */}
        <div
          className={`bg-white border-l border-gray-200 flex transition-all duration-300 ease-in-out relative ${
            sidebarExpanded ? "w-80 rounded-l-xl" : "w-2"
          }`}
        >
          {/* Sidebar Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Content Area */}
            <div
              className={`flex-1 overflow-y-auto transition-opacity duration-300 scroll-smooth ${sidebarExpanded ? "opacity-100" : "opacity-0"}`}
            >
              {/* Fixed Headers Container */}
              <div className="p-6">
                {!selectedCategory ? (
                  // Show all categories when none is selected
                  <div className="space-y-4">
                    {/* Add Sections Header */}
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

                    {/* Default State Message */}
                    <div className="flex items-center justify-center p-8 mt-20">
                      <div className="text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="font-medium text-gray-700">Select a Category</p>
                        <p className="text-sm mt-1">Choose a category above to view personnel</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Show only the selected category with sticky header
                  <div className="h-full flex flex-col">
                    {/* Sticky Category Header */}
                    <div
                      className="sticky top-0 z-20 bg-white flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all hover:bg-gray-50 shadow-sm border-2 border-blue-200 bg-blue-50 mb-4"
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

                    {/* Scrollable Personnel List */}
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

              {/* Fixed Bottom Instructions */}
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
          </div>

          {/* Floating Arrow Toggle Button - Only visible when sidebar is expanded, positioned outside frame */}
          {sidebarExpanded && (
            <div className="absolute top-1/2 transform -translate-y-1/2 -left-6">
              <button
                onClick={toggleSidebar}
                className="w-6 h-16 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 hover:shadow-lg"
              >
                {/* Arrow pointing right (to close sidebar) */}
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Arrow button when sidebar is collapsed - positioned to open sidebar */}
          {!sidebarExpanded && (
            <div className="absolute top-1/2 transform -translate-y-1/2 -left-6">
              <button
                onClick={toggleSidebar}
                className="w-6 h-16 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 hover:shadow-lg"
              >
                {/* Arrow pointing left (to open sidebar) */}
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

MapPage.layout = (e: JSX.Element) => <Authenticated children={e} />

export default MapPage
