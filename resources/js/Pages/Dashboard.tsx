"use client"

import React from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Users, MapPin, Calendar, Maximize2, AlertTriangle, CheckCircle, X, ChevronLeft, RefreshCw } from "lucide-react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import PersonnelMarkersLayer from "./Mapping/Partials/PersonnelMarkersLayer"
import SanJuanBoundary from './Mapping/GeoJSON/sanjuan-boundary.json';

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

// Add this new component for the department filter dropdown
const DepartmentFilter = ({ onReset }: { onReset: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  const departments = ["Management Department", "Monitoring Department", "Planning Department", "Others"]

  const handleSelect = (dept: string) => {
    setSelectedDepartment(dept)
    setIsOpen(false)
  }
  
  const resetDepartmentFilter = () => {
    setSelectedDepartment(null);
  }

  // // Expose reset function to parent component
  // useEffect(() => {
  //   if (onReset) {
  //     // Store the reset function reference
  //     window.resetDepartmentFilter = () => {
  //       setSelectedDepartment(null)
  //     }
  //   }
  // }, [onReset])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-4 py-2 rounded-md border ${
          selectedDepartment ? "bg-blue-600 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300"
        }`}
      >
        <span>{selectedDepartment || "By Department"}</span>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => handleSelect(dept)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Month")
  const [isMapMaximized, setIsMapMaximized] = useState(false)
  const [isEventsExpanded, setIsEventsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null)
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null)
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null)

  // Event handlers for upcoming events
  const handleViewAllEvents = () => {
    setIsEventsExpanded(true)
  }

  const handleBackToSummary = () => {
    setIsEventsExpanded(false)
  }

  const handleEventClick = (event: any) => {
    console.log("Event clicked:", event.title)
    // Add event detail logic here - could open event details modal
    alert(`Event Details: ${event.title} at ${event.time}`)
  }

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
      setCurrentTime(now.toLocaleDateString("en-US", options))
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const personnelCategories = [
    { name: "Management", count: 12, color: "bg-blue-500" },
    { name: "Monitoring", count: 8, color: "bg-blue-500" },
    { name: "Planning", count: 10, color: "bg-blue-500" },
    { name: "Others", count: 15, color: "bg-blue-500" },
  ]

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

  const notifications = [
    {
      id: 1,
      message: "New incident report submitted",
      time: "2 min ago",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      id: 2,
      message: "John joined team 01",
      time: "5 min ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 3,
      message: "Alert got clearance of the facility",
      time: "8 min ago",
      icon: CheckCircle,
      color: "text-blue-600",
    },
    {
      id: 4,
      message: "Report upload was rejected",
      time: "12 min ago",
      icon: AlertTriangle,
      color: "text-orange-600",
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

  // Line Chart Component
  const LineChart = ({ data, title, color = "green" }: { data: any[]; title: string; color?: string }) => {
    const maxValue = Math.max(...data.map((item) => item.value))
    const minValue = Math.min(...data.map((item) => item.value))
    const range = maxValue - minValue

    const getColorClasses = (color: string) => {
      const colors = {
        blue: { line: "stroke-blue-500", fill: "fill-blue-100", point: "fill-blue-500" },
        green: { line: "stroke-green-500", fill: "fill-green-100", point: "fill-green-500" },
        red: { line: "stroke-red-500", fill: "fill-red-100", point: "fill-red-500" },
      }
      return colors[color as keyof typeof colors] || colors.green
    }

    const colorClasses = getColorClasses(color)

    const generatePath = () => {
      const width = 400
      const height = 150
      const padding = 20

      const points = data.map((item, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
        const y = height - padding - ((item.value - minValue) / range) * (height - 2 * padding)
        return `${x},${y}`
      })

      return `M ${points.join(" L ")}`
    }

    const generateAreaPath = () => {
      const width = 400
      const height = 150
      const padding = 20

      const points = data.map((item, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
        const y = height - padding - ((item.value - minValue) / range) * (height - 2 * padding)
        return { x, y }
      })

      const pathStart = `M ${padding},${height - padding}`
      const pathLine = points.map((p) => `L ${p.x},${p.y}`).join(" ")
      const pathEnd = `L ${width - padding},${height - padding} Z`

      return pathStart + " " + pathLine + " " + pathEnd
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colorClasses.point.replace("fill-", "bg-")}`}></div>
            <span className="text-sm text-gray-600">Trend</span>
          </div>
        </div>

        <div className="relative">
          <svg width="100%" height="200" viewBox="0 0 400 150" className="overflow-visible">
            <defs>
              <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <path d={generateAreaPath()} className={`${colorClasses.fill} opacity-30`} />

            <path
              d={generatePath()}
              fill="none"
              className={`${colorClasses.line}`}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {data.map((item, index) => {
              const width = 400
              const height = 150
              const padding = 20
              const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
              const y = height - padding - ((item.value - minValue) / range) * (height - 2 * padding)
              const isHovered = hoveredLineIndex === index

              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? "6" : "4"}
                    className={`${colorClasses.point} transition-all duration-200 cursor-pointer`}
                    onMouseEnter={() => setHoveredLineIndex(index)}
                    onMouseLeave={() => setHoveredLineIndex(null)}
                  />
                  {isHovered && (
                    <g>
                      <rect x={x - 25} y={y - 35} width="50" height="25" rx="4" fill="#374151" opacity="0.9" />
                      <text x={x} y={y - 20} textAnchor="middle" className="fill-white text-xs font-medium">
                        {item.value}h
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>

          <div className="flex justify-between mt-2 px-5">
            {data.map((item, index) => (
              <span key={index} className="text-xs text-gray-600">
                {item.month}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{maxValue}h</p>
            <p className="text-xs text-gray-600">Peak</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">
              {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}h
            </p>
            <p className="text-xs text-gray-600">Average</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{minValue}h</p>
            <p className="text-xs text-gray-600">Low</p>
          </div>
        </div>
      </div>
    )
  }

  // Fixed Pie Chart Component - No gaps between segments
  const PieChart = ({ data, title }: { data: any[]; title: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Helper function to convert polar coordinates to cartesian
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      }
    }

    // Helper function to create SVG arc path
    const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
      const start = polarToCartesian(centerX, centerY, radius, endAngle)
      const end = polarToCartesian(centerX, centerY, radius, startAngle)
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

      return [
        "M",
        centerX,
        centerY,
        "L",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
        "Z",
      ].join(" ")
    }

    // Calculate angles for each segment - ensuring no gaps
    let currentAngle = 0
    const dataWithAngles = data.map((item, index) => {
      const percentage = (item.value / total) * 100
      const angleSize = (item.value / total) * 360 // Convert to degrees
      const startAngle = currentAngle
      const endAngle = currentAngle + angleSize

      // For the last segment, ensure it closes the circle perfectly
      if (index === data.length - 1) {
        const finalEndAngle = 360
        currentAngle = finalEndAngle
        return {
          ...item,
          percentage,
          startAngle,
          endAngle: finalEndAngle,
          angleSize: finalEndAngle - startAngle,
        }
      }

      currentAngle += angleSize
      return {
        ...item,
        percentage,
        startAngle,
        endAngle,
        angleSize,
      }
    })

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

        <div className="flex items-center justify-between">
          {/* Pie Chart */}
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {dataWithAngles.map((item, index) => {
                const isHovered = hoveredPieIndex === index
                const radius = isHovered ? 85 : 80

                return (
                  <path
                    key={index}
                    d={createArcPath(100, 100, radius, item.startAngle, item.endAngle)}
                    fill={item.color}
                    className="transition-all duration-300 cursor-pointer"
                    style={{
                      filter: isHovered ? "brightness(1.1)" : "brightness(1)",
                    }}
                    onMouseEnter={() => setHoveredPieIndex(index)}
                    onMouseLeave={() => setHoveredPieIndex(null)}
                  />
                )
              })}

              {/* Center circle */}
              <circle cx="100" cy="100" r="40" fill="white" className="drop-shadow-sm" />

              {/* Center text */}
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="fill-gray-900 text-lg font-bold transform rotate-90"
                style={{ transformOrigin: "100px 100px" }}
              >
                {total}
              </text>
              <text
                x="100"
                y="110"
                textAnchor="middle"
                className="fill-gray-600 text-xs transform rotate-90"
                style={{ transformOrigin: "100px 100px" }}
              >
                Total
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div className="w-1/2 ml-4 space-y-2 overflow-hidden">
            {dataWithAngles.map((item, index) => {
              const isHovered = hoveredPieIndex === index

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isHovered ? "bg-gray-50 shadow-sm" : "hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setHoveredPieIndex(index)}
                  onMouseLeave={() => setHoveredPieIndex(null)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className={`text-xs truncate ${isHovered ? "font-medium" : ""}`}>{item.label}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-xs font-semibold ${isHovered ? "text-gray-900" : "text-gray-700"}`}>
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Head title="CDRRMO Dashboard" />

      <div className="min-h-screen bg-gray-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-[#1B2560] text-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-white" />
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>
              </div>
              <div className="text-sm font-mono text-white">{currentTime}</div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">


          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">14.2h</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-red-600 text-sm font-medium">-8.3%</span>
                <span className="text-gray-600 text-sm ml-1">improvement</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personnel Tracking Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">PERSONNEL TRACKING</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                        LIVE
                      </span>
                    </div>
                    <Link href="/map" className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      <Maximize2 className="w-4 h-4" />
                      Full View
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <div
                        className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg h-64 cursor-pointer hover:shadow-md transition-all"
                      >
                        {/* <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium">Interactive Map</p>
                            <p className="text-sm text-gray-500">Click to maximize</p>
                          </div>
                        </div>

                        <div className="absolute top-4 left-8 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
                        <div className="absolute top-12 right-12 w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
                        <div className="absolute bottom-8 left-16 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
                        <div className="absolute bottom-16 right-8 w-4 h-4 bg-purple-500 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
                        <div className="absolute top-20 left-1/2 w-4  -4 bg-orange-500 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
                        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-pink-500 rounded-full animate-pulse shadow-lg border-2 border-white"></div> */}
                        <Link href="/map">
                          <MapContainer className='min-h-full h-[16rem] z-0 border-2 border-dashed border-gray-300 rounded-lg' center={[14.6034363, 121.0389469]} zoom={14} scrollWheelZoom={false} dragging={false} zoomControl={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <GeoJSON
                                style={{color: '#0000CC', weight: 4}}
                                // @ts-ignore
                                data={SanJuanBoundary}
                            />
                            <PersonnelMarkersLayer isClickable={false} />
                        </MapContainer>
                        </Link>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {personnelCategories.map((category) => (
                        <div
                          key={category.name}
                          className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center`}>
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-600">{category.count}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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

              {/* Additional Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChart data={responseTimeData} title="Average Response Time (hours)" color="green" />
                <PieChart data={personnelDistribution} title="Personnel Distribution" />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isEventsExpanded ? "All Events" : "Upcoming Events"}
                    </h3>
                    {isEventsExpanded ? (
                      <button
                        onClick={handleBackToSummary}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors hover:underline"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <button
                        onClick={handleViewAllEvents}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors hover:underline"
                      >
                        View All
                      </button>
                    )}
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
                            <Calendar className="w-4 h-4 opacity-75 ml-3 flex-shrink-0" />
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
                            <Calendar className="w-4 h-4 opacity-75 ml-3 flex-shrink-0" />
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {React.createElement(notification.icon, { className: `w-4 h-4 mt-0.5 ${notification.color}` })}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maximized Map Modal */}
        {isMapMaximized && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">EMPLOYEE ACTIVITIES</h3>
                  <p className="text-sm text-gray-600">Real-time location tracking of all active personnel</p>
                </div>
                <button onClick={() => setIsMapMaximized(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search and Filter Controls */}
              <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    placeholder="Search Employee"
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <DepartmentFilter onReset={() => {}} />
              </div>

              <div className="flex-1 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
                {/* Map Content */}
                <div className="absolute inset-0">
                  <div className="w-full h-full bg-white">
                    {/* Map background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v60c16.569 0 30-13.431 30-30z'/%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      ></div>
                    </div>

                    {/* Simulated map markers for different departments */}
                    <div
                      className="absolute top-12 left-16 w-6 h-6 bg-red-500 rounded-full animate-pulse shadow-lg border-4 border-white"
                      title="Management Department"
                    ></div>
                    <div
                      className="absolute top-24 right-24 w-6 h-6 bg-blue-500 rounded-full animate-pulse shadow-lg border-4 border-white"
                      title="Monitoring Department"
                    ></div>
                    <div
                      className="absolute bottom-16 left-32 w-6 h-6 bg-green-500 rounded-full animate-pulse shadow-lg border-4 border-white"
                      title="Planning Department"
                    ></div>
                    <div
                      className="absolute bottom-32 right-16 w-6 h-6 bg-purple-500 rounded-full animate-pulse shadow-lg border-4 border-white"
                      title="Management Department"
                    ></div>
                    <div
                      className="absolute top-40 left-1/2 w-6 h-6 bg-orange-500 rounded-full animate-pulse shadow-lg border-4 border-white"
                      title="Others"
                    ></div>
                    <div
                      className="absolute top-1/2 right-1/3 w-6 h-6 bg-pink-500 rounded-full animate-pulse shadow-lg border-4 border-white"
                      title="Monitoring Department"
                    ></div>
                    <div
                      className="absolute bottom-1/4 left-1/4 w-6 h-6 bg-yellow-500 rounded-full animate-pulse shadow-lg border-4 border-white"
                      title="Planning Department"
                    ></div>
                    <div
                      className="absolute top-1/3 right-1/2 w-6 h-6 bg-indigo-500 rounded-full animate-pulse shadow-lg border-4 border-white"
                      title="Others"
                    ></div>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200">
                  <div className="text-sm font-medium mb-2">Department Legend</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs">Management Department</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs">Monitoring Department</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs">Planning Department</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs">Others</span>
                    </div>
                  </div>
                </div>

                {/* Refresh Button */}
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => {
                      // Reset department filter
                      // if (window.resetDepartmentFilter) {
                      //   window.resetDepartmentFilter()
                      // }

                      // TODO: re-setup department filter resetting
                      

                      // You can add more reset functionality here like clearing search
                      console.log("Refreshing map and resetting all filters")
                    }}
                    className="bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                    title="Reset all filters"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

Dashboard.layout = (e: React.ReactElement) => <AuthenticatedLayout children={e} />
