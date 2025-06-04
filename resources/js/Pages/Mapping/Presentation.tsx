"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { JSX } from "react"
import {
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Radio,
  Battery,
  Signal,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  User,
  Briefcase,
  Activity,
  X,
  Navigation,
  Cloud,
  Thermometer,
  Wind,
  EyeOff,
} from "lucide-react"

// San Juan City locations
const SAN_JUAN_LOCATIONS = [
  "Barangay Addition Hills",
  "Barangay Batis",
  "Barangay Corazon de Jesus",
  "Barangay Ermitaño",
  "Barangay Greenhills",
  "Barangay Halo-halo",
  "Barangay Isabelita",
  "Barangay Kabayanan",
  "Barangay Little Baguio",
  "Barangay Maytunas",
  "Barangay Onse",
  "Barangay Pasadeña",
  "Barangay Pedro Cruz",
  "Barangay Progreso",
  "Barangay Rivera",
  "Barangay Salapan",
  "San Perfecto",
  "Barangay Santa Lucia",
  "Barangay Tibagan",
  "Barangay West Crame",
  "San Juan City Hall",
  "San Juan Medical Center",
  "Greenhills Shopping Center",
  "Club Filipino",
  "Pinaglabanan Shrine",
  "San Juan Sports Complex",
  "N. Domingo Bridge",
  "Santolan Bridge Area",
  "Wilson Street",
  "F. Blumentritt Road",
]

// Mock data - replace with your actual data source
const MOCK_PERSONNEL = Array(85)
  .fill(null)
  .map((_, i) => {
    const status = ["Active", "Standby", "Responding", "Off-duty"][Math.floor(Math.random() * 4)]
    const isOffDuty = status === "Off-duty"

    return {
      id: i + 1,
      name: `${["Juan", "Maria", "Carlos", "Ana", "Miguel", "Sofia", "Rafael", "Elena"][Math.floor(Math.random() * 8)]} ${["Santos", "Reyes", "Cruz", "Garcia", "Mendoza", "Lim", "Tan", "Gonzales"][Math.floor(Math.random() * 8)]}`,
      photo: `/placeholder.svg?height=80&width=80`,
      position: [
        "Field Officer",
        "Rescue Team",
        "Medical Response",
        "Operations",
        "Communications",
        "Fire Response",
        "Logistics",
        "Command",
      ][Math.floor(Math.random() * 8)],
      location: isOffDuty ? null : SAN_JUAN_LOCATIONS[Math.floor(Math.random() * SAN_JUAN_LOCATIONS.length)],
      status: status,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
      batteryLevel: isOffDuty ? null : Math.floor(Math.random() * 100),
      signalStrength: isOffDuty ? null : Math.floor(Math.random() * 5) + 1,
      department: ["Management", "Monitoring", "Planning", "Others"][Math.floor(Math.random() * 4)],
      recentLocations: isOffDuty
        ? []
        : Array(8)
            .fill(null)
            .map((_, j) => ({
              location: SAN_JUAN_LOCATIONS[Math.floor(Math.random() * SAN_JUAN_LOCATIONS.length)],
              timestamp: new Date(Date.now() - (j + 1) * Math.floor(Math.random() * 1800000)).toISOString(),
              duration: Math.floor(Math.random() * 120) + 5, // 5-125 minutes
            })),
    }
  })

function Presentation() {
  const [personnel, setPersonnel] = useState(MOCK_PERSONNEL)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(8) // seconds
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [countdown, setCountdown] = useState(8)
  const [selectedPerson, setSelectedPerson] = useState(null)

  // Reduced items per page to fit screen better
  const ITEMS_PER_PAGE = 15
  const filteredPersonnel = personnel.filter((p) => selectedDepartment === "All" || p.department === selectedDepartment)
  const TOTAL_PAGES = Math.ceil(filteredPersonnel.length / ITEMS_PER_PAGE)

  // Department counts
  const departmentCounts = {
    Management: personnel.filter((p) => p.department === "Management" && p.status !== "Off-duty").length,
    Monitoring: personnel.filter((p) => p.department === "Monitoring" && p.status !== "Off-duty").length,
    Planning: personnel.filter((p) => p.department === "Planning" && p.status !== "Off-duty").length,
    Others: personnel.filter((p) => p.department === "Others" && p.status !== "Off-duty").length,
  }

  const totalActive = Object.values(departmentCounts).reduce((sum, count) => sum + count, 0)
  const emergencyCount = personnel.filter((p) => p.status === "Responding").length

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())

      // Simulate data changes
      setPersonnel((prev) =>
        prev.map((p) => {
          // If person is off-duty, don't update location or other tracking data
          if (p.status === "Off-duty") {
            return p
          }

          // Randomly change status (including to off-duty)
          const newStatus =
            Math.random() > 0.9
              ? ["Active", "Standby", "Responding", "Off-duty"][Math.floor(Math.random() * 4)]
              : p.status

          // If status changed to off-duty, remove location data
          const isNowOffDuty = newStatus === "Off-duty"

          return {
            ...p,
            location: isNowOffDuty
              ? null
              : Math.random() > 0.8
                ? SAN_JUAN_LOCATIONS[Math.floor(Math.random() * SAN_JUAN_LOCATIONS.length)]
                : p.location,
            status: newStatus,
            lastUpdated: Math.random() > 0.7 ? new Date().toISOString() : p.lastUpdated,
            batteryLevel: isNowOffDuty
              ? null
              : p.batteryLevel > 5
                ? Math.random() > 0.8
                  ? Math.max(0, p.batteryLevel - 2)
                  : p.batteryLevel
                : p.batteryLevel,
            signalStrength: isNowOffDuty
              ? null
              : Math.random() > 0.9
                ? Math.floor(Math.random() * 5) + 1
                : p.signalStrength,
            recentLocations: isNowOffDuty ? [] : p.recentLocations,
          }
        }),
      )
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  // Auto-play and countdown
  useEffect(() => {
    if (!isAutoPlay || TOTAL_PAGES <= 1) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCurrentPage((prevPage) => (prevPage + 1) % TOTAL_PAGES)
          return autoPlaySpeed
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isAutoPlay, autoPlaySpeed, TOTAL_PAGES])

  // Update clock every second
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(clockTimer)
  }, [])

  // Reset countdown when page changes manually
  useEffect(() => {
    setCountdown(autoPlaySpeed)
  }, [currentPage, autoPlaySpeed])

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500"
      case "Standby":
        return "bg-amber-500"
      case "Responding":
        return "bg-red-500"
      case "Off-duty":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 border-emerald-200"
      case "Standby":
        return "bg-amber-50 border-amber-200"
      case "Responding":
        return "bg-red-50 border-red-200"
      case "Off-duty":
        return "bg-gray-50 border-gray-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getTimeSince = (dateString) => {
    const date = new Date(dateString)
    const seconds = Math.floor((currentTime - date) / 1000)

    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const getBatteryIcon = (level) => {
    if (level === null) return null
    if (level <= 10) return <Battery className="w-3 h-3 text-red-500" />
    if (level <= 30) return <Battery className="w-3 h-3 text-amber-500" />
    return <Battery className="w-3 h-3 text-emerald-500" />
  }

  const getSignalIcon = (strength) => {
    if (strength === null) return null
    if (strength <= 2) return <Signal className="w-3 h-3 text-red-500" />
    if (strength <= 3) return <Signal className="w-3 h-3 text-amber-500" />
    return <Signal className="w-3 h-3 text-emerald-500" />
  }

  const getDepartmentIcon = (dept) => {
    switch (dept) {
      case "Management":
        return <Briefcase className="w-4 h-4" />
      case "Monitoring":
        return <Activity className="w-4 h-4" />
      case "Planning":
        return <Users className="w-4 h-4" />
      case "Others":
        return <User className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const currentPersonnel = filteredPersonnel
    .sort((a, b) => {
      const statusPriority = { Responding: 0, Active: 1, Standby: 2, "Off-duty": 3 }
      return statusPriority[a.status] - statusPriority[b.status]
    })
    .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)

  // Create empty cards to fill the grid
  const emptyCards = Array(Math.max(0, ITEMS_PER_PAGE - currentPersonnel.length)).fill(null)

  return (
    <div className="bg-gray-100 h-screen overflow-hidden flex flex-col">
      {/* Header - Using #1B2560 color */}
      <header className="text-white px-6 py-3 shadow-md flex-shrink-0" style={{ backgroundColor: "#1B2560" }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              href="/map"
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Map</span>
            </Link>
            <div className="h-6 w-px bg-opacity-30 bg-white"></div>
            <h1 className="text-xl font-bold tracking-tight">PERSONNEL TRACKING</h1>
            <Badge className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs font-medium">LIVE</Badge>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-opacity-20 bg-white">
              <Users className="text-blue-300 w-4 h-4" />
              <span className="text-sm font-medium">{totalActive} Active</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-opacity-20 bg-white">
              <AlertTriangle className="text-red-300 w-4 h-4" />
              <span className="text-sm font-medium">{emergencyCount} Responding</span>
            </div>

            <div className="text-sm font-bold text-white px-3 py-1.5 rounded-md bg-opacity-20 bg-white">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-4 flex flex-col overflow-hidden">
          {/* Controls */}
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm flex-shrink-0">
            <div className="flex gap-3">
              {["All", "Management", "Monitoring", "Planning", "Others"].map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  className={`${
                    selectedDepartment === dept ? "text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  } relative`}
                  style={{
                    backgroundColor: selectedDepartment === dept ? "#1B2560" : "",
                  }}
                  onClick={() => {
                    setSelectedDepartment(dept)
                    setCurrentPage(0)
                  }}
                >
                  {dept !== "All" && <span className="mr-2">{getDepartmentIcon(dept)}</span>}
                  <span className="mr-2">{dept}</span>
                  {dept !== "All" && (
                    <Badge variant="secondary" className="bg-white text-xs px-1.5 py-0.5" style={{ color: "#1B2560" }}>
                      {departmentCounts[dept] || 0}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Auto-play Controls - Fixed positioning */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Auto-play:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAutoPlay(!isAutoPlay)}
                  className={`px-2 py-1 ${isAutoPlay ? "bg-emerald-100 border-emerald-300 text-emerald-700" : ""}`}
                >
                  {isAutoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>

                <div className="relative">
                  <select
                    value={autoPlaySpeed}
                    onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white min-w-[60px] relative z-10"
                    disabled={!isAutoPlay}
                    style={{ zIndex: 50 }}
                  >
                    <option value={2}>2s</option>
                    <option value={5}>5s</option>
                    <option value={8}>8s</option>
                    <option value={10}>10s</option>
                    <option value={15}>15s</option>
                  </select>
                </div>
              </div>

              {isAutoPlay && TOTAL_PAGES > 1 && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "#f0f4ff" }}
                >
                  <RotateCcw className="w-3 h-3" style={{ color: "#1B2560" }} />
                  <span className="text-sm" style={{ color: "#1B2560" }}>
                    Next in {countdown}s
                  </span>
                  <div className="w-16 rounded-full h-2" style={{ backgroundColor: "#d0d8ff" }}>
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        backgroundColor: "#1B2560",
                        width: `${((autoPlaySpeed - countdown) / autoPlaySpeed) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personnel Grid - Fixed height grid with equal spacing */}
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-5 gap-3 h-full auto-rows-fr">
              {/* Actual Personnel Cards */}
              {currentPersonnel.map((person) => (
                <Card
                  key={person.id}
                  className={`border ${
                    person.status === "Responding" ? "border-red-300 shadow-red-100" : "border-gray-200"
                  } hover:shadow-md transition-shadow overflow-hidden cursor-pointer hover:bg-gray-50`}
                  onClick={() => setSelectedPerson(person)}
                >
                  <div className={`h-1 ${getStatusColor(person.status)}`}></div>
                  <div className="p-3 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative">
                        <img
                          src={person.photo || "/placeholder.svg"}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(person.status)} border-2 border-white`}
                        ></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{person.name}</h3>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium border-[#1B2560] text-[#1B2560] px-1.5 py-0.5"
                        >
                          {person.department}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 mb-2 truncate">{person.position}</div>

                    {/* Location - Only show if not off-duty */}
                    <div className="flex items-center gap-1 mb-2">
                      {person.status === "Off-duty" ? (
                        <div className="flex items-center gap-1 text-gray-400">
                          <EyeOff className="w-3 h-3 flex-shrink-0" />
                          <span className="text-xs">Location tracking disabled</span>
                        </div>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 flex-shrink-0 text-[#1B2560]" />
                          <span className="text-gray-700 text-xs truncate">{person.location}</span>
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="text-xs">{getTimeSince(person.lastUpdated)}</span>
                      </div>

                      {/* Battery and Signal - Only show if not off-duty */}
                      {person.status !== "Off-duty" && (
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {getBatteryIcon(person.batteryLevel)}
                            <span className="text-xs ml-1">{person.batteryLevel}%</span>
                          </div>
                          {getSignalIcon(person.signalStrength)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 text-xs font-medium ${getStatusBg(person.status)}`}>{person.status}</div>
                </Card>
              ))}

              {/* Empty Cards to maintain grid structure */}
              {emptyCards.map((_, index) => (
                <Card key={`empty-${index}`} className="border border-gray-200 opacity-0 pointer-events-none">
                  <div className="h-1 bg-transparent"></div>
                  <div className="p-3 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-transparent"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-transparent mb-1"></div>
                        <div className="h-4 bg-transparent"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-transparent mb-2"></div>
                    <div className="h-3 bg-transparent mb-2"></div>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="h-3 bg-transparent w-12"></div>
                      <div className="h-3 bg-transparent w-12"></div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 h-6 bg-transparent"></div>
                </Card>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-4 flex justify-between items-center bg-white p-3 rounded-lg shadow-sm flex-shrink-0">
            <div className="text-gray-600 text-sm">
              Showing {currentPage * ITEMS_PER_PAGE + 1}-
              {Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredPersonnel.length)} of {filteredPersonnel.length}{" "}
              personnel
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                  <button
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === currentPage ? "bg-[#1B2560]" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => setCurrentPage(i)}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                <Radio className="text-emerald-500 w-4 h-4 animate-pulse" />
                <span className="text-emerald-600 font-medium text-sm">Live Tracking Active</span>
              </div>
            </div>
          </footer>
        </div>

        {/* Right Sidebar - Enhanced with more content */}
        <div className="w-72 bg-white shadow-md p-4 flex-shrink-0 overflow-y-auto">
          {/* System Status */}
          <div className="p-4 text-white rounded-lg mb-4" style={{ backgroundColor: "#1B2560" }}>
            <h4 className="font-semibold mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              System Status
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{personnel.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-medium text-emerald-300">{totalActive}</span>
              </div>
              <div className="flex justify-between">
                <span>Responding:</span>
                <span className="font-medium text-red-300">{emergencyCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Updated:</span>
                <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Weather Info */}
          <div className="mb-4">
            <h4 className="font-semibold mb-3 text-gray-700 flex items-center">
              <Cloud className="w-4 h-4 mr-2" />
              Weather - San Juan City
            </h4>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">28°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">15 km/h</span>
                </div>
              </div>
              <p className="text-xs text-blue-700">Partly cloudy, light winds</p>
              <p className="text-xs text-blue-600 mt-1">Visibility: Good</p>
            </div>
          </div>

          {/* Status Legend */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-3 text-gray-700">Status Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-700">Active - On duty in the field</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-gray-700">Standby - Ready to deploy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-700">Responding - Emergency response</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm text-gray-700">Off-duty - Not available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personnel Detail Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ backgroundColor: "#1B2560" }}>
              <div className="flex items-center gap-4">
                <img
                  src={selectedPerson.photo || "/placeholder.svg"}
                  alt={selectedPerson.name}
                  className="w-16 h-16 rounded-full object-cover border-3 border-white"
                />
                <div className="text-white">
                  <h2 className="text-xl font-bold">{selectedPerson.name}</h2>
                  <p className="text-blue-200">{selectedPerson.position}</p>
                  <Badge className="bg-white text-[#1B2560] mt-1">{selectedPerson.department}</Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPerson(null)}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Current Status */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-[#1B2560]" />
                  Current Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Location - Only show if not off-duty */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Location</div>
                    {selectedPerson.status === "Off-duty" ? (
                      <div className="font-medium text-gray-400 flex items-center gap-1 mt-1">
                        <EyeOff className="w-4 h-4" />
                        <span>Tracking disabled</span>
                      </div>
                    ) : (
                      <div className="font-semibold text-gray-900">{selectedPerson.location}</div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Status</div>
                    <div
                      className={`font-semibold ${
                        selectedPerson.status === "Active"
                          ? "text-emerald-600"
                          : selectedPerson.status === "Standby"
                            ? "text-amber-600"
                            : selectedPerson.status === "Responding"
                              ? "text-red-600"
                              : "text-gray-600"
                      }`}
                    >
                      {selectedPerson.status}
                    </div>
                  </div>

                  {/* Battery - Only show if not off-duty */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Battery Level</div>
                    {selectedPerson.status === "Off-duty" ? (
                      <div className="font-medium text-gray-400">Not available</div>
                    ) : (
                      <div className="font-semibold text-gray-900">{selectedPerson.batteryLevel}%</div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Last Updated</div>
                    <div className="font-semibold text-gray-900">{getTimeSince(selectedPerson.lastUpdated)}</div>
                  </div>
                </div>
              </div>

              {/* Recent Locations - Only show if not off-duty */}
              {selectedPerson.status !== "Off-duty" ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-[#1B2560]" />
                    Recent Location History - San Juan City
                  </h3>
                  <div className="space-y-3">
                    {selectedPerson.recentLocations.map((loc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#1B2560]"></div>
                          <div>
                            <div className="font-medium text-gray-900">{loc.location}</div>
                            <div className="text-sm text-gray-600">{new Date(loc.timestamp).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">Duration: {formatDuration(loc.duration)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                  <EyeOff className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Location Tracking Disabled</h3>
                  <p className="text-gray-500">
                    Location tracking is disabled when personnel are off-duty. Location history will be available when
                    they return to active status.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Presentation
