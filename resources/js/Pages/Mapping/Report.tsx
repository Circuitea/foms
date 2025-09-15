"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Download, FileText, Clock, MapPin, Users, BarChart3, X } from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { JSX } from "react"
import { Link } from "@inertiajs/react"

// Mock personnel data for reports
const personnelReportData = [
  {
    id: 1,
    name: "John Smith",
    position: "Manager",
    department: "Management",
    lat: 14.5995,
    lng: 120.9842,
    timestamp: "2024-01-15 09:30:00",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Director",
    department: "Management",
    lat: 14.6042,
    lng: 120.9822,
    timestamp: "2024-01-15 10:15:00",
    status: "active",
  },
  {
    id: 3,
    name: "Alex Thompson",
    position: "Monitor",
    department: "Monitoring",
    lat: 14.6015,
    lng: 120.9825,
    timestamp: "2024-01-15 11:00:00",
    status: "active",
  },
  // Add more mock data as needed
]

type ReportType = "monthly" | "weekly" | "daily" | "annual"

interface DateRange {
  start: string
  end: string
}

interface YearRange {
  start: string
  end: string
}

function Report() {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null)
  const [monthlyRange, setMonthlyRange] = useState<DateRange>({ start: "", end: "" })
  const [weeklyMonth, setWeeklyMonth] = useState("")
  const [weeklyRange, setWeeklyRange] = useState<DateRange>({ start: "", end: "" })
  const [dailyMonth, setDailyMonth] = useState("")
  const [dailyDate, setDailyDate] = useState("")
  const [annualRange, setAnnualRange] = useState<YearRange>({ start: "", end: "" })
  const [isGenerating, setIsGenerating] = useState(false)

  // Clear weekly date range when month changes
  useEffect(() => {
    setWeeklyRange({ start: "", end: "" })
  }, [weeklyMonth])

  // Add this new useEffect after the existing ones
  useEffect(() => {
    // Clear end date if it's before the start date
    if (weeklyRange.start && weeklyRange.end && weeklyRange.end < weeklyRange.start) {
      setWeeklyRange((prev) => ({ ...prev, end: "" }))
    }
  }, [weeklyRange.start])

  // Clear daily date when month changes
  useEffect(() => {
    setDailyDate("")
  }, [dailyMonth])

  // Add this useEffect after the existing ones, around line 60
  useEffect(() => {
    // Clear end year if it's before the start year
    if (annualRange.start && annualRange.end && Number.parseInt(annualRange.end) < Number.parseInt(annualRange.start)) {
      setAnnualRange((prev) => ({ ...prev, end: "" }))
    }
  }, [annualRange.start])

  useEffect(() => {
    // Clear end month if it's before the start month
    if (monthlyRange.start && monthlyRange.end && monthlyRange.end < monthlyRange.start) {
      setMonthlyRange((prev) => ({ ...prev, end: "" }))
    }
  }, [monthlyRange.start])

  // Check if any report type has data
  const hasAnnualData = annualRange.start || annualRange.end
  const hasMonthlyData = monthlyRange.start || monthlyRange.end
  const hasWeeklyData = weeklyMonth || weeklyRange.start || weeklyRange.end
  const hasDailyData = dailyMonth || dailyDate

  // Determine active report type based on data
  const activeReportType = hasAnnualData
    ? "annual"
    : hasMonthlyData
      ? "monthly"
      : hasWeeklyData
        ? "weekly"
        : hasDailyData
          ? "daily"
          : null

  // Check if other report types should be disabled
  const isAnnualDisabled = activeReportType && activeReportType !== "annual"
  const isMonthlyDisabled = activeReportType && activeReportType !== "monthly"
  const isWeeklyDisabled = activeReportType && activeReportType !== "weekly"
  const isDailyDisabled = activeReportType && activeReportType !== "daily"

  const handleGenerateReport = async (reportType: ReportType) => {
    setIsGenerating(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const filteredData = personnelReportData
    let filename = ""

    switch (reportType) {
      case "monthly":
        filename = `personnel-monthly-report-${monthlyRange.start}-to-${monthlyRange.end}.csv`
        break
      case "weekly":
        filename = `personnel-weekly-report-${weeklyRange.start}-to-${weeklyRange.end}.csv`
        break
      case "daily":
        filename = `personnel-daily-report-${dailyDate}.csv`
        break
      case "annual":
        filename = `personnel-annual-report-${annualRange.start}-to-${annualRange.end}.csv`
        break
    }

    // Generate CSV content
    const csvContent = generateCSV(filteredData)

    // Download CSV file
    downloadCSV(csvContent, filename)

    setIsGenerating(false)
  }

  const generateCSV = (data: typeof personnelReportData) => {
    const headers = ["ID", "Name", "Position", "Department", "Latitude", "Longitude", "Timestamp", "Status"]
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.id,
          `"${row.name}"`,
          `"${row.position}"`,
          `"${row.department}"`,
          row.lat,
          row.lng,
          `"${row.timestamp}"`,
          row.status,
        ].join(","),
      ),
    ]
    return csvRows.join("\n")
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearAllData = () => {
    setAnnualRange({ start: "", end: "" })
    setMonthlyRange({ start: "", end: "" })
    setWeeklyMonth("")
    setWeeklyRange({ start: "", end: "" })
    setDailyMonth("")
    setDailyDate("")
    setSelectedReportType(null)
  }

  // Generate year options (from 2015 to current year + 1)
  const currentYear = new Date().getFullYear()
  const yearOptions = []
  for (let year = 2015; year <= currentYear + 1; year++) {
    yearOptions.push(year.toString())
  }

  const isMonthlyValid = monthlyRange.start && monthlyRange.end
  const isWeeklyValid = weeklyMonth && weeklyRange.start && weeklyRange.end
  const isDailyValid = dailyMonth && dailyDate
  const isAnnualValid = annualRange.start && annualRange.end

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      {/* Header - Navy Blue Theme - Made Sticky */}
      <div className="sticky top-0 z-50 bg-[#1B2560] px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Link
            href="/map"
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
            <span className="text-sm font-medium">Back to Map</span>
          </Link>
          <div className="w-px h-6 bg-white/20"></div>
          <h1 className="text-2xl font-bold text-white">PERSONNEL REPORTS</h1>
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">EXPORT</Badge>
        </div>
        {/* Clear All Button */}
        <Button
          onClick={clearAllData}
          disabled={!activeReportType || false}
          variant="outline"
          size="sm"
          className="bg-white text-[#1B2560] border-white hover:bg-gray-100 hover:text-[#1B2560] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Description */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Personnel Location Reports</h2>
            <p className="text-gray-600">
              Export detailed personnel tracking data for specific time periods. Choose from annual, monthly, weekly, or
              daily reports.
            </p>
            {activeReportType && (
              <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You are currently filling out a{" "}
                  <span className="capitalize font-semibold">{activeReportType}</span> report. Complete this report or
                  click "Clear All" to start a different report type.
                </p>
              </div>
            )}
          </div>

          {/* Report Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Annual Report Card */}
            <Card
              className={`transition-all duration-200 ${
                isAnnualDisabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:shadow-lg"
              } ${selectedReportType === "annual" || activeReportType === "annual" ? "ring-2 ring-[#1B2560] bg-blue-50" : ""}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isAnnualDisabled ? "bg-gray-400" : "bg-[#1B2560]"}`}
                  >
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`text-lg ${isAnnualDisabled ? "text-gray-500" : ""}`}>
                      Annual Report
                    </CardTitle>
                    <CardDescription className={isAnnualDisabled ? "text-gray-400" : ""}>
                      Get data for multiple years
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isAnnualDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      From Year
                    </label>
                    <select
                      value={annualRange.start}
                      onChange={(e) => setAnnualRange((prev) => ({ ...prev, start: e.target.value }))}
                      disabled={isAnnualDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isAnnualDisabled ? undefined : setSelectedReportType("annual"))}
                    >
                      <option value="">Choose start year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isAnnualDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      To Year
                    </label>
                    <select
                      value={annualRange.end}
                      onChange={(e) => setAnnualRange((prev) => ({ ...prev, end: e.target.value }))}
                      disabled={isAnnualDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isAnnualDisabled ? undefined : setSelectedReportType("annual"))}
                    >
                      <option value="">Choose end year</option>
                      {yearOptions
                        .filter(
                          (year) => !annualRange.start || Number.parseInt(year) >= Number.parseInt(annualRange.start),
                        )
                        .map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                    </select>
                  </div>
                  <Button
                    onClick={() => handleGenerateReport("annual")}
                    disabled={!isAnnualValid || isGenerating || isAnnualDisabled || false}
                    className="w-full bg-[#1B2560] hover:bg-[#1B2560]/90 text-white disabled:bg-gray-400"
                  >
                    {isGenerating && selectedReportType === "annual" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Annual CSV
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Report Card */}
            <Card
              className={`transition-all duration-200 ${
                isMonthlyDisabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:shadow-lg"
              } ${selectedReportType === "monthly" || activeReportType === "monthly" ? "ring-2 ring-[#1B2560] bg-blue-50" : ""}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isMonthlyDisabled ? "bg-gray-400" : "bg-[#1B2560]"}`}
                  >
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`text-lg ${isMonthlyDisabled ? "text-gray-500" : ""}`}>
                      Monthly Report
                    </CardTitle>
                    <CardDescription className={isMonthlyDisabled ? "text-gray-400" : ""}>
                      Get data for multiple months
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isMonthlyDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      From Month
                    </label>
                    <input
                      type="month"
                      value={monthlyRange.start}
                      onChange={(e) => setMonthlyRange((prev) => ({ ...prev, start: e.target.value }))}
                      disabled={isMonthlyDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isMonthlyDisabled ? undefined : setSelectedReportType("monthly"))}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isMonthlyDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      To Month
                    </label>
                    <input
                      type="month"
                      value={monthlyRange.end}
                      onChange={(e) => setMonthlyRange((prev) => ({ ...prev, end: e.target.value }))}
                      min={monthlyRange.start || undefined}
                      disabled={isMonthlyDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isMonthlyDisabled ? undefined : setSelectedReportType("monthly"))}
                    />
                  </div>
                  <Button
                    onClick={() => handleGenerateReport("monthly")}
                    disabled={!isMonthlyValid || isGenerating || isMonthlyDisabled || false}
                    className="w-full bg-[#1B2560] hover:bg-[#1B2560]/90 text-white disabled:bg-gray-400"
                  >
                    {isGenerating && selectedReportType === "monthly" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Monthly CSV
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Report Card */}
            <Card
              className={`transition-all duration-200 ${
                isWeeklyDisabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:shadow-lg"
              } ${selectedReportType === "weekly" || activeReportType === "weekly" ? "ring-2 ring-[#1B2560] bg-blue-50" : ""}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isWeeklyDisabled ? "bg-gray-400" : "bg-[#1B2560]"}`}
                  >
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`text-lg ${isWeeklyDisabled ? "text-gray-500" : ""}`}>
                      Weekly Report
                    </CardTitle>
                    <CardDescription className={isWeeklyDisabled ? "text-gray-400" : ""}>
                      Get data for specific weeks
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isWeeklyDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      Select Month
                    </label>
                    <input
                      type="month"
                      value={weeklyMonth}
                      onChange={(e) => setWeeklyMonth(e.target.value)}
                      disabled={isWeeklyDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isWeeklyDisabled ? undefined : setSelectedReportType("weekly"))}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isWeeklyDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      From Date
                    </label>
                    <input
                      type="date"
                      value={weeklyRange.start}
                      onChange={(e) => setWeeklyRange((prev) => ({ ...prev, start: e.target.value }))}
                      min={weeklyMonth ? `${weeklyMonth}-01` : undefined}
                      max={
                        weeklyMonth
                          ? `${weeklyMonth}-${new Date(new Date(weeklyMonth).getFullYear(), new Date(weeklyMonth).getMonth() + 1, 0).getDate().toString().padStart(2, "0")}`
                          : undefined
                      }
                      disabled={!weeklyMonth || isWeeklyDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isWeeklyDisabled ? undefined : setSelectedReportType("weekly"))}
                    />
                    {!weeklyMonth && !isWeeklyDisabled && (
                      <p className="text-xs text-gray-500 mt-1">Please select a month first</p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isWeeklyDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      To Date
                    </label>
                    <input
                      type="date"
                      value={weeklyRange.end}
                      onChange={(e) => setWeeklyRange((prev) => ({ ...prev, end: e.target.value }))}
                      min={weeklyRange.start || (weeklyMonth ? `${weeklyMonth}-01` : undefined)}
                      max={
                        weeklyMonth
                          ? `${weeklyMonth}-${new Date(new Date(weeklyMonth).getFullYear(), new Date(weeklyMonth).getMonth() + 1, 0).getDate().toString().padStart(2, "0")}`
                          : undefined
                      }
                      disabled={!weeklyMonth || isWeeklyDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isWeeklyDisabled ? undefined : setSelectedReportType("weekly"))}
                    />
                    {!weeklyMonth && !isWeeklyDisabled && (
                      <p className="text-xs text-gray-500 mt-1">Please select a month first</p>
                    )}
                    {weeklyMonth && !weeklyRange.start && !isWeeklyDisabled && (
                      <p className="text-xs text-gray-500 mt-1">Please select a start date first</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleGenerateReport("weekly")}
                    disabled={!isWeeklyValid || isGenerating || isWeeklyDisabled || false}
                    className="w-full bg-[#1B2560] hover:bg-[#1B2560]/90 text-white disabled:bg-gray-400"
                  >
                    {isGenerating && selectedReportType === "weekly" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Weekly CSV
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Report Card */}
            <Card
              className={`transition-all duration-200 ${
                isDailyDisabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer hover:shadow-lg"
              } ${selectedReportType === "daily" || activeReportType === "daily" ? "ring-2 ring-[#1B2560] bg-blue-50" : ""}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${isDailyDisabled ? "bg-gray-400" : "bg-[#1B2560]"}`}
                  >
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className={`text-lg ${isDailyDisabled ? "text-gray-500" : ""}`}>Daily Report</CardTitle>
                    <CardDescription className={isDailyDisabled ? "text-gray-400" : ""}>
                      Get data for a specific day
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDailyDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      Select Month
                    </label>
                    <input
                      type="month"
                      value={dailyMonth}
                      onChange={(e) => setDailyMonth(e.target.value)}
                      disabled={isDailyDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isDailyDisabled ? undefined : setSelectedReportType("daily"))}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${isDailyDisabled ? "text-gray-400" : "text-gray-700"}`}
                    >
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={dailyDate}
                      onChange={(e) => setDailyDate(e.target.value)}
                      min={dailyMonth ? `${dailyMonth}-01` : undefined}
                      max={
                        dailyMonth
                          ? `${dailyMonth}-${new Date(new Date(dailyMonth).getFullYear(), new Date(dailyMonth).getMonth() + 1, 0).getDate().toString().padStart(2, "0")}`
                          : undefined
                      }
                      disabled={!dailyMonth || isDailyDisabled || false}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-[#1B2560] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      onClick={() => (isDailyDisabled ? undefined : setSelectedReportType("daily"))}
                    />
                    {!dailyMonth && !isDailyDisabled && (
                      <p className="text-xs text-gray-500 mt-1">Please select a month first</p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleGenerateReport("daily")}
                    disabled={!isDailyValid || isGenerating || isDailyDisabled || false}
                    className="w-full bg-[#1B2560] hover:bg-[#1B2560]/90 text-white disabled:bg-gray-400"
                  >
                    {isGenerating && selectedReportType === "daily" ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Daily CSV
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Information */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <MapPin className="h-5 w-5" />
                Report Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What's Included in Reports:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Personnel ID and Name</li>
                    <li>• Position and Department</li>
                    <li>• GPS Coordinates (Latitude/Longitude)</li>
                    <li>• Timestamp of Location</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Report Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Real-time location data</li>
                    <li>• CSV format for easy analysis</li>
                    <li>• Customizable date ranges</li>
                    <li>• Comprehensive tracking history</li>
                    <li>• Department-wise filtering</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Personnel</p>
                    <p className="text-2xl font-bold text-gray-900">45</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold text-gray-900">38</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reports Generated</p>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data Points</p>
                    <p className="text-2xl font-bold text-gray-900">2.4K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

Report.layout = (e: JSX.Element) => <Authenticated pageTitle="Report" children={e} />

export default Report
