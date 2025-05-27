"use client"

import Authenticated from "@/Layouts/AuthenticatedLayout"
import { useState, useEffect } from "react"
import { router } from "@inertiajs/react"
import type React from "react"
import { BellRing } from "lucide-react"

interface Notification {
  id: string
  title: string
  type:
    | "Task Assignment"
    | "Field Report"
    | "Resource Request"
    | "Team Deployment"
    | "Incident Update"
    | "Meeting Notice"
    | "Equipment Alert"
  location: string
  status: "Unread" | "Checked"
  timestamp: string
  timeAgo: string
  priority: "urgent" | "high" | "normal" | "low"
  department: string
  assignedTo?: string
  reportedBy: string
  taskId?: string
  archivedAt?: string
}

const generateCDRRMOStaffNotifications = (): Notification[] => {
  const now = new Date()

  return [
    {
      id: "1",
      title: "Emergency Response Team Alpha - Deploy to Barangay Greenhills",
      type: "Team Deployment",
      location: "Barangay Greenhills",
      status: "Unread",
      timestamp: new Date(now.getTime() - 8 * 60000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeAgo: "8 minutes ago",
      priority: "urgent",
      department: "Emergency Operations",
      assignedTo: "Team Alpha Leader",
      reportedBy: "Operations Chief Martinez",
      taskId: "SJ-OPS-2025-001",
    },
    {
      id: "2",
      title: "Field Assessment Report - N. Domingo Street Flooding",
      type: "Field Report",
      location: "N. Domingo Street",
      status: "Unread",
      timestamp: new Date(now.getTime() - 15 * 60000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeAgo: "15 minutes ago",
      priority: "high",
      department: "Field Operations",
      reportedBy: "Field Officer Santos",
      taskId: "SJ-FIELD-2025-012",
    },
    {
      id: "3",
      title: "Request for additional rescue boats - Pasig River operations",
      type: "Resource Request",
      location: "Pasig River Staging Area",
      status: "Checked",
      timestamp: new Date(now.getTime() - 32 * 60000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeAgo: "32 minutes ago",
      priority: "high",
      department: "Logistics Division",
      assignedTo: "Supply Officer Cruz",
      reportedBy: "Marine Unit Leader",
      taskId: "SJ-LOG-2025-008",
    },
    {
      id: "4",
      title: "Staff Meeting - Post-Incident Review scheduled for 3:00 PM",
      type: "Meeting Notice",
      location: "CDRRMO Conference Room",
      status: "Checked",
      timestamp: new Date(now.getTime() - 45 * 60000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeAgo: "45 minutes ago",
      priority: "normal",
      department: "Administration",
      reportedBy: "CDRRMO Director",
    },
    {
      id: "5",
      title: "Equipment maintenance required - Rescue Vehicle Unit 3",
      type: "Equipment Alert",
      location: "CDRRMO Motor Pool",
      status: "Checked",
      timestamp: new Date(now.getTime() - 67 * 60000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeAgo: "1 hour ago",
      priority: "normal",
      department: "Vehicle Maintenance",
      assignedTo: "Mechanic Reyes",
      reportedBy: "Fleet Manager",
      taskId: "SJ-MAINT-2025-003",
    },
    {
      id: "6",
      title: "Incident Status Update - Little Baguio landslide monitoring",
      type: "Incident Update",
      location: "Barangay Little Baguio",
      status: "Unread",
      timestamp: new Date(now.getTime() - 89 * 60000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeAgo: "1 hour ago",
      priority: "high",
      department: "Risk Assessment Unit",
      reportedBy: "Geologist Dr. Fernandez",
      taskId: "SJ-RISK-2025-005",
    },
  ]
}

export default function ListNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")
  const [archivedNotifications, setArchivedNotifications] = useState<Notification[]>([])

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("sanjuan_cdrrmo_staff_notifications")
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(parsed)
      } catch (error) {
        console.error("Error parsing saved notifications:", error)
        const initialNotifications = generateCDRRMOStaffNotifications()
        setNotifications(initialNotifications)
        localStorage.setItem("sanjuan_cdrrmo_staff_notifications", JSON.stringify(initialNotifications))
      }
    } else {
      const initialNotifications = generateCDRRMOStaffNotifications()
      setNotifications(initialNotifications)
      localStorage.setItem("sanjuan_cdrrmo_staff_notifications", JSON.stringify(initialNotifications))
    }

    // Load archived notifications
    const savedArchivedNotifications = localStorage.getItem("sanjuan_cdrrmo_archived_notifications")
    if (savedArchivedNotifications) {
      try {
        const parsedArchived = JSON.parse(savedArchivedNotifications)
        setArchivedNotifications(parsedArchived)
      } catch (error) {
        console.error("Error parsing archived notifications:", error)
      }
    }
  }, [])

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("sanjuan_cdrrmo_staff_notifications", JSON.stringify(notifications))
    }
  }, [notifications])

  useEffect(() => {
    if (archivedNotifications.length >= 0) {
      localStorage.setItem("sanjuan_cdrrmo_archived_notifications", JSON.stringify(archivedNotifications))
    }
  }, [archivedNotifications])

  const updateNotificationStatus = (id: string, newStatus: "Unread" | "Checked") => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, status: newStatus } : notification)),
    )
  }

  const toggleNotificationStatus = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const notification = notifications.find((n) => n.id === id)
    if (notification) {
      const newStatus = notification.status === "Unread" ? "Checked" : "Unread"
      updateNotificationStatus(id, newStatus)
    }
    setShowDropdown(null)
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, status: "Checked" as const })))
  }

  const deleteNotification = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const notificationToArchive = notifications.find((n) => n.id === id)
    if (notificationToArchive) {
      // Add to archived
      const updatedArchived = [
        ...archivedNotifications,
        { ...notificationToArchive, archivedAt: new Date().toISOString() },
      ]
      setArchivedNotifications(updatedArchived)
      localStorage.setItem("sanjuan_cdrrmo_archived_notifications", JSON.stringify(updatedArchived))

      // Remove from active
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }
    setShowDropdown(null)
  }

  const restoreNotification = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const notificationToRestore = archivedNotifications.find((n) => n.id === id)
    if (notificationToRestore) {
      // Remove archivedAt property and add back to active
      const { archivedAt, ...restoredNotification } = notificationToRestore
      setNotifications((prev) => [...prev, restoredNotification])

      // Remove from archived
      setArchivedNotifications((prev) => prev.filter((n) => n.id !== id))
      localStorage.setItem(
        "sanjuan_cdrrmo_archived_notifications",
        JSON.stringify(archivedNotifications.filter((n) => n.id !== id)),
      )
    }
    setShowDropdown(null)
  }

  const permanentlyDeleteNotification = (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setArchivedNotifications((prev) => prev.filter((n) => n.id !== id))
    setShowDropdown(null)
  }

  const handleNotificationClick = (notificationId: string) => {
    updateNotificationStatus(notificationId, "Checked")
    setTimeout(() => {
      router.visit(`/notifications/${notificationId}`)
    }, 100)
  }

  const handleDropdownClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  const unreadCount = notifications.filter((n) => n.status === "Unread").length

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-700 text-white animate-pulse"
      case "high":
        return "bg-red-600 text-white"
      case "normal":
        return "text-white"
      case "low":
        return "bg-gray-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Task Assignment":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
        )
      case "Field Report":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        )
      case "Team Deployment":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            ></path>
          </svg>
        )
      case "Resource Request":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            ></path>
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        )
    }
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200" style={{ backgroundColor: "#1B2560" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellRing className="text-white" />
                <h1 className="text-2xl font-semibold text-white">Task Notifications</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-white text-sm">
                  {currentTime.toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <button
                  onClick={markAllAsRead}
                  className="text-white hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white">
            <div className="flex">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "active"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Active Notifications ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "archived"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Archived ({archivedNotifications.length})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-gray-50 divide-y divide-gray-200">
            {activeTab === "active" ? (
              notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`p-6 hover:bg-white transition-colors cursor-pointer ${
                      notification.status === "Unread" ? "bg-blue-50 border-l-4 shadow-sm" : "bg-white hover:shadow-sm"
                    }`}
                    style={{
                      borderLeftColor: notification.status === "Unread" ? "#1B2560" : undefined,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Status Dot */}
                      <div
                        className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                          notification.status === "Unread" ? "" : "bg-gray-400"
                        } ${notification.priority === "urgent" && notification.status === "Unread" ? "animate-pulse" : ""}`}
                        style={{
                          backgroundColor: notification.status === "Unread" ? "#1B2560" : undefined,
                        }}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Priority Badge and Title */}
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${getPriorityBadgeStyle(notification.priority)}`}
                            style={{
                              backgroundColor: notification.priority === "normal" ? "#1B2560" : undefined,
                            }}
                          >
                            {notification.priority.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            <span className="text-xs text-gray-600 font-medium">{notification.type}</span>
                          </div>
                          {notification.taskId && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-mono">
                              {notification.taskId}
                            </span>
                          )}
                        </div>

                        <h3
                          className={`text-base font-medium mb-3 ${
                            notification.status === "Unread" ? "text-gray-900" : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {/* Details Row */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Location:</span> {notification.location}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {notification.department}
                          </div>
                          <div>
                            <span className="font-medium">Reported by:</span> {notification.reportedBy}
                          </div>
                        </div>

                        {/* Assignment Info */}
                        {notification.assignedTo && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-600">Assigned to: </span>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {notification.assignedTo}
                            </span>
                          </div>
                        )}

                        {/* Bottom Row - Time and Status */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{notification.timestamp}</span>
                          <span className="text-xs text-gray-400">({notification.timeAgo})</span>
                          <span
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              notification.status === "Unread" ? "text-white" : "bg-gray-400 text-white"
                            }`}
                            style={{
                              backgroundColor: notification.status === "Unread" ? "#1B2560" : undefined,
                            }}
                          >
                            {notification.status}
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Menu */}
                      <div className="relative flex-shrink-0" onClick={handleDropdownClick}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowDropdown(showDropdown === notification.id ? null : notification.id)
                          }}
                          className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 5v.01M12 12v.01M12 19v.01"
                            ></path>
                          </svg>
                        </button>

                        {showDropdown === notification.id && (
                          <div className="absolute right-0 top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-lg">
                            <button
                              onClick={(e) => toggleNotificationStatus(notification.id, e)}
                              className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100"
                            >
                              {notification.status === "Unread" ? (
                                <>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    ></path>
                                  </svg>
                                  Mark as read
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M15 17h5l-5 5-5-5h5v-12"
                                    ></path>
                                  </svg>
                                  Mark as unread
                                </>
                              )}
                            </button>
                            <button
                              onClick={(e) => deleteNotification(notification.id, e)}
                              className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 text-red-600"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                ></path>
                              </svg>
                              Archive
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center bg-gray-50">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-5 5-5-5h5v-12"
                    ></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active notifications</h3>
                  <p className="text-gray-500">All caught up! No pending tasks or updates for CDRRMO staff.</p>
                </div>
              )
            ) : archivedNotifications.length > 0 ? (
              archivedNotifications.map((notification) => (
                <div key={notification.id} className="p-6 bg-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Archived indicator */}
                    <div className="w-4 h-4 rounded-full mt-1 flex-shrink-0 bg-gray-400" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Priority Badge and Title */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs px-2 py-1 rounded font-medium bg-gray-500 text-white">ARCHIVED</span>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notification.type)}
                          <span className="text-xs text-gray-600 font-medium">{notification.type}</span>
                        </div>
                        {notification.taskId && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-mono">
                            {notification.taskId}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-medium mb-3 text-gray-600">{notification.title}</h3>

                      {/* Details Row */}
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                        <div>
                          <span className="font-medium">Location:</span> {notification.location}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {notification.department}
                        </div>
                        <div>
                          <span className="font-medium">Archived:</span>{" "}
                          {new Date(notification.archivedAt!).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{notification.timestamp}</span>
                        <span className="text-xs text-gray-400">({notification.timeAgo})</span>
                      </div>
                    </div>

                    {/* Dropdown Menu for Archived */}
                    <div className="relative flex-shrink-0" onClick={handleDropdownClick}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowDropdown(showDropdown === notification.id ? null : notification.id)
                        }}
                        className="h-8 w-8 flex items-center justify-center hover:bg-gray-200 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 5v.01M12 12v.01M12 19v.01"
                          ></path>
                        </svg>
                      </button>

                      {showDropdown === notification.id && (
                        <div className="absolute right-0 top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 shadow-lg">
                          <button
                            onClick={(e) => restoreNotification(notification.id, e)}
                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 text-green-600"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              ></path>
                            </svg>
                            Restore
                          </button>
                          <button
                            onClick={(e) => permanentlyDeleteNotification(notification.id, e)}
                            className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 text-red-600"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                            Delete Permanently
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-gray-50">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8l6 6m0 0l6-6m-6 6V3"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No archived notifications</h3>
                <p className="text-gray-500">No notifications have been archived yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ListNotifications.layout = (e: React.JSX.Element) => <Authenticated children={e} />
