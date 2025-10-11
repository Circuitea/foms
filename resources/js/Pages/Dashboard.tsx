"use client"

import React from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Users, MapPin, Calendar, Maximize2, AlertTriangle, CheckCircle, X, ChevronLeft, RefreshCw, LayoutDashboard } from "lucide-react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import PersonnelMarkersLayer from "./Mapping/Partials/PersonnelMarkersLayer"
import SanJuanBoundary from './Mapping/sanjuan-boundary.json';

import 'leaflet/dist/leaflet.css';


// Mock data for charts
const requestOverviewData = [
  { month: "Apr", week: 45, monthData: 65, year: 85 },
  { month: "May", week: 52, monthData: 72, year: 92 },
  { month: "Jun", week: 48, monthData: 68, year: 88 },
  { month: "Jul", week: 61, monthData: 81, year: 95 },
  { month: "Aug", week: 55, monthData: 75, year: 90 },
  { month: "Sep", week: 67, monthData: 87, year: 98 },
  { month: "Oct", week: 59, monthData: 79, year: 94 },
  { month: "Nov", week: 63, monthData: 83, year: 96 },
  { month: "Dec", week: 58, monthData: 78, year: 93 },
  { month: "Jan", week: 71, monthData: 91, year: 102 },
  { month: "Feb", week: 66, monthData: 86, year: 99 },
  { month: "Mar", week: 69, monthData: 89, year: 101 },
]

const incidentReportData = [
  { month: "Apr", week: 12, monthData: 25, year: 45 },
  { month: "May", week: 18, monthData: 32, year: 52 },
  { month: "Jun", week: 15, monthData: 28, year: 48 },
  { month: "Jul", week: 22, monthData: 38, year: 58 },
  { month: "Aug", week: 19, monthData: 35, year: 55 },
  { month: "Sep", week: 25, monthData: 42, year: 62 },
  { month: "Oct", week: 21, monthData: 39, year: 59 },
  { month: "Nov", week: 27, monthData: 45, year: 65 },
  { month: "Dec", week: 23, monthData: 41, year: 61 },
  { month: "Jan", week: 29, monthData: 48, year: 68 },
  { month: "Feb", week: 26, monthData: 44, year: 64 },
  { month: "Mar", week: 31, monthData: 51, year: 71 },
]

const responseTimeData = [
  { month: "Apr", value: 24, trend: "down" as const },
  { month: "May", value: 18, trend: "down" as const },
  { month: "Jun", value: 22, trend: "up" as const },
  { month: "Jul", value: 15, trend: "down" as const },
  { month: "Aug", value: 19, trend: "up" as const },
  { month: "Sep", value: 12, trend: "down" as const },
  { month: "Oct", value: 16, trend: "up" as const },
  { month: "Nov", value: 11, trend: "down" as const },
  { month: "Dec", value: 14, trend: "up" as const },
]

const personnelDistribution = [
  { label: "Management", value: 12, color: "#3B82F6" },
  { label: "Monitoring", value: 8, color: "#10B981" },
  { label: "Planning", value: 10, color: "#F59E0B" },
  { label: "Operations", value: 15, color: "#EF4444" },
  { label: "Support", value: 6, color: "#8B5CF6" },
]

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Month")
  const [isEventsExpanded, setIsEventsExpanded] = useState(false)
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null)
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null)

  const handleEventClick = (event: any) => {
    console.log("Event clicked:", event.title)
    // Add event detail logic here - could open event details modal
    alert(`Event Details: ${event.title} at ${event.time}`)
  }

  const upcomingEvents = [
    {
      id: 1,
      title: "Emergency Planning",
      time: "9:00 AM",
      date: "Today",
      location: "Conference Room A",
      attendees: 12,
      status: "confirmed",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      id: 2,
      title: "Training and Seminar",
      time: "2:00 PM",
      date: "Today",
      location: "Training Hall",
      attendees: 25,
      status: "confirmed",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      id: 3,
      title: "PTV Procurement Meeting",
      time: "4:00 PM",
      date: "Tomorrow",
      location: "Meeting Room B",
      attendees: 8,
      status: "pending",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    {
      id: 4,
      title: "Emergency vs Contingency",
      time: "6:00 PM",
      date: "Tomorrow",
      location: "Main Hall",
      attendees: 30,
      status: "confirmed",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    {
      id: 5,
      title: "Development Planning",
      time: "8:00 PM",
      date: "Dec 15",
      location: "Conference Room C",
      attendees: 15,
      status: "confirmed",
      color: "bg-red-100 text-red-800 border-red-200",
    },
    {
      id: 6,
      title: "Risk Assessment Workshop",
      time: "10:00 AM",
      date: "Dec 16",
      location: "Workshop Area",
      attendees: 20,
      status: "pending",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      id: 7,
      title: "Community Outreach Program",
      time: "1:00 PM",
      date: "Dec 17",
      location: "Community Center",
      attendees: 50,
      status: "confirmed",
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    {
      id: 8,
      title: "Equipment Maintenance Check",
      time: "3:00 PM",
      date: "Dec 18",
      location: "Equipment Bay",
      attendees: 6,
      status: "confirmed",
      color: "bg-gray-100 text-gray-800 border-gray-200",
    },
  ]

  // Interactive Bar Chart Component
  const InteractiveBarChart = ({
    data,
    dataKey,
    title,
    stats,
    chartId,
  }: {
    data: any[]
    dataKey: string
    title: string
    stats: { value1: number; label1: string; value2: number; label2: string }
    chartId: string
  }) => {
    const maxValue = Math.max(...data.map((item) => item[dataKey]))

    const getBarColor = (period: string) => {
      switch (period) {
        case "Week":
          return "bg-blue-500"
        case "Month":
          return "bg-green-500"
        case "Year":
          return "bg-red-500"
        default:
          return "bg-gray-500"
      }
    }

    const getHoverColor = (period: string) => {
      switch (period) {
        case "Week":
          return "bg-blue-600"
        case "Month":
          return "bg-green-600"
        case "Year":
          return "bg-red-600"
        default:
          return "bg-gray-600"
      }
    }

    return (
      <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex gap-1">
            {["Week", "Month", "Year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-xs rounded transition-all duration-200 ${
                  selectedPeriod === period
                    ? period === "Week"
                      ? "bg-blue-500 text-white shadow-md"
                      : period === "Month"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.value1.toLocaleString()}</p>
            <p className="text-sm text-gray-600">{stats.label1}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.value2.toLocaleString()}</p>
            <p className="text-sm text-gray-600">{stats.label2}</p>
          </div>
        </div>

        {/* Fixed Chart Container */}
        <div className="relative h-48 bg-gray-50 rounded-lg p-4">
          <div className="h-full flex items-end justify-between gap-1">
            {data.map((item, index) => {
              const value = item[dataKey]
              const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0
              const barHeight = Math.max((heightPercentage / 100) * 160, 4) // 160px is the available height
              const isHovered = hoveredBarIndex === index

              return (
                <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 mb-2 transform -translate-y-full">
                      {item.month}: {value}
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className={`w-full max-w-8 rounded-t transition-all duration-300 cursor-pointer ${
                      isHovered ? getHoverColor(selectedPeriod) : getBarColor(selectedPeriod)
                    } ${isHovered ? "shadow-lg transform scale-105" : ""}`}
                    style={{
                      height: `${barHeight}px`,
                      minHeight: "4px",
                    }}
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  ></div>

                  {/* Month label */}
                  <span
                    className={`text-xs mt-2 transition-colors duration-200 ${
                      isHovered ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center mt-4 gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${getBarColor(selectedPeriod)}`}></div>
            <span className="text-xs text-gray-600">{selectedPeriod}ly Data</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-6 px-6 py-6">
          {/* Summary Cards */}
          <div className="flex-[3]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Personnel</p>
                    <p className="text-2xl font-bold text-gray-900">51</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">+12%</span>
                  <span className="text-gray-600 text-sm ml-1">from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Response Rate</p>
                    <p className="text-2xl font-bold text-gray-900">94.2%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">+2.1%</span>
                  <span className="text-gray-600 text-sm ml-1">from last month</span>
                </div>
              </div>

              
            </div>

            <div>
              {/* Main Content Area */}
              <div className="space-y-6">
                {/* Personnel Tracking Section */}
                <div className="bg-white rounded-lg shadow-xs border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">PERSONNEL TRACKING</h3>
                      </div>
                      
                    </div>
                  </div>

                  <div className="p-6">
                    <div
                      className="relative bg-linear-to-br from-blue-50 to-green-50 rounded-lg h-64 cursor-pointer hover:shadow-md transition-all"
                    >
                      <Link href="/map">
                        <MapContainer className='min-h-full h-64 z-0 border-2 border-dashed border-gray-300 rounded-lg' center={[14.6034363, 121.0389469]} zoom={14} scrollWheelZoom={false} dragging={false} zoomControl={false}>
                          <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <GeoJSON
                              style={{color: '#0000CC', weight: 4}}
                              // @ts-ignore
                              data={SanJuanBoundary}
                          />
                        </MapContainer>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Analytics Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InteractiveBarChart
                    data={requestOverviewData}
                    dataKey={selectedPeriod === "Week" ? "week" : selectedPeriod === "Month" ? "monthData" : "year"}
                    title="Request Overview"
                    stats={{
                      value1: 789,
                      label1: "Total Requests",
                      value2: 658,
                      label2: "Approved Requests",
                    }}
                    chartId="bar"
                  />

                  <InteractiveBarChart
                    data={incidentReportData}
                    dataKey={selectedPeriod === "Week" ? "week" : selectedPeriod === "Month" ? "monthData" : "year"}
                    title="Incident Reports"
                    stats={{
                      value1: 1221,
                      label1: "Total Incidents",
                      value2: 1120,
                      label2: "Resolved Cases",
                    }}
                    chartId="bar"
                  />
                </div>
              </div>

              
            </div>

          </div>
          <div className="flex-1 h-full space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white h-full rounded-lg shadow-xs border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming Events
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {isEventsExpanded ? (
                  // Expanded Events View
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                          event.id === 1 || event.id === 5
                            ? "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                            : event.id === 2
                              ? "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                              : event.id === 3
                                ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                : event.id === 4
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100"
                                  : event.id === 6
                                    ? "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100"
                                    : event.id === 7
                                      ? "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
                                      : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100"
                        }`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-sm leading-tight">{event.title}</p>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  event.status === "confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {event.status}
                              </span>
                            </div>
                            <div className="space-y-1 text-xs opacity-75">
                              <p>
                                📅 {event.date} at {event.time}
                              </p>
                              <p>📍 {event.location}</p>
                              <p>👥 {event.attendees} attendees</p>
                            </div>
                          </div>
                          <Calendar className="w-4 h-4 opacity-75 ml-3 shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Summary Events View (first 5 events)
                  upcomingEvents
                    .slice(0, 5)
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                          event.id === 1 || event.id === 5
                            ? "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                            : event.id === 2
                              ? "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
                              : event.id === 3
                                ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                : "bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100"
                        }`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm leading-tight">{event.title}</p>
                            <p className="text-xs opacity-75 mt-1">{event.time}</p>
                          </div>
                          <Calendar className="w-4 h-4 opacity-75 ml-3 shrink-0" />
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

Dashboard.layout = (e: React.ReactElement) => <AuthenticatedLayout PageIcon={LayoutDashboard} pageTitle="Dashboard" children={e} />
