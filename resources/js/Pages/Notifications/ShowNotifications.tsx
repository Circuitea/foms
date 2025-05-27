"use client"
import { useState, useEffect } from "react"
import { router } from "@inertiajs/react"
import Authenticated from "@/Layouts/AuthenticatedLayout"

const getCDRRMOStaffNotificationData = (id: string) => {
  const savedNotifications = localStorage.getItem("sanjuan_cdrrmo_staff_notifications")
  if (savedNotifications) {
    try {
      const notifications = JSON.parse(savedNotifications)
      const notification = notifications.find((n: any) => n.id === id)
      if (notification) {
        return {
          ...notification,
          detailedMessage: getStaffDetailedMessage(notification.type, notification.title),
          coordinates: getSanJuanCoordinates(notification.location),
          instructions: getStaffInstructions(notification.type),
          resources: getRequiredResources(notification.type),
          contacts: getRelevantContacts(notification.type),
        }
      }
    } catch (error) {
      console.error("Error parsing notifications:", error)
    }
  }

  return null
}

const getStaffDetailedMessage = (type: string, title: string) => {
  switch (type) {
    case "Task Assignment":
      return "Emergency Response Team Alpha is required to deploy immediately to Barangay Greenhills for flood response operations. Team should bring standard rescue equipment including life vests, ropes, and communication devices. Coordinate with Barangay Captain for local situation assessment."
    case "Field Report":
      return "Field assessment completed for N. Domingo Street flooding incident. Water level measured at 2.5 feet at deepest point near Santolan intersection. Approximately 15 vehicles stranded, 3 families evacuated from ground floor residences. Drainage system appears blocked with debris."
    case "Resource Request":
      return "Marine Unit Leader requests additional rescue boats for Pasig River operations. Current inventory shows 2 boats operational, need 2 more for effective coverage of affected riverside areas. Estimated deployment time: 30 minutes upon approval."
    case "Team Deployment":
      return "Team deployment order issued for immediate response to emergency situation. All assigned personnel must report to staging area within 15 minutes. Bring personal protective equipment and emergency response kit."
    case "Incident Update":
      return "Ongoing monitoring of landslide-prone areas in Barangay Little Baguio shows increased soil movement. Geological assessment team recommends continued surveillance and preparation for possible evacuation advisory."
    case "Meeting Notice":
      return "Mandatory staff meeting scheduled to review recent incident response procedures and discuss improvements to emergency protocols. All department heads and team leaders required to attend."
    case "Equipment Alert":
      return "Rescue Vehicle Unit 3 requires immediate maintenance attention. Engine diagnostic shows potential transmission issues. Vehicle temporarily out of service pending repair completion."
    default:
      return "Internal CDRRMO staff notification. Please review details and take appropriate action as per department protocols."
  }
}

const getSanJuanCoordinates = (location: string) => {
  const coordinates = {
    "Barangay Greenhills": "14.6025° N, 121.0456° E",
    "N. Domingo Street": "14.6089° N, 121.0267° E",
    "Pasig River Staging Area": "14.5947° N, 121.0456° E",
    "CDRRMO Conference Room": "14.6019° N, 121.0355° E",
    "CDRRMO Motor Pool": "14.6015° N, 121.0348° E",
    "Barangay Little Baguio": "14.6156° N, 121.0423° E",
  }
  return coordinates[location as keyof typeof coordinates] || "14.6019° N, 121.0355° E"
}

const getStaffInstructions = (type: string) => {
  const instructions = {
    "Task Assignment": [
      "Report to staging area within 15 minutes",
      "Bring standard rescue equipment and PPE",
      "Coordinate with local Barangay officials",
      "Maintain radio communication with Operations Center",
      "Document all activities for post-incident report",
    ],
    "Field Report": [
      "Review assessment findings with team leader",
      "Prepare follow-up monitoring schedule",
      "Coordinate with Public Works for drainage clearing",
      "Update incident status in CDRRMO database",
      "Prepare situation report for Director",
    ],
    "Resource Request": [
      "Verify current equipment inventory",
      "Coordinate with Logistics Division for procurement",
      "Arrange transportation for additional resources",
      "Update resource allocation tracking system",
      "Confirm delivery timeline with requesting unit",
    ],
    "Team Deployment": [
      "Assemble at designated staging area immediately",
      "Conduct equipment check before deployment",
      "Establish communication protocols",
      "Brief team on specific mission objectives",
      "Ensure all safety protocols are followed",
    ],
    "Incident Update": [
      "Continue monitoring as per assessment schedule",
      "Report any changes in conditions immediately",
      "Coordinate with Risk Assessment Unit",
      "Prepare contingency plans for escalation",
      "Update community liaison officers",
    ],
    "Meeting Notice": [
      "Review agenda materials before meeting",
      "Prepare department status reports",
      "Bring relevant incident documentation",
      "Ensure deputy coverage for ongoing operations",
      "Submit any agenda items to Secretary",
    ],
    "Equipment Alert": [
      "Remove vehicle from active service roster",
      "Coordinate with Fleet Manager for repair schedule",
      "Arrange alternative transportation if needed",
      "Update vehicle maintenance logs",
      "Notify Operations Center of reduced capacity",
    ],
  }
  return (
    instructions[type as keyof typeof instructions] || [
      "Follow standard CDRRMO protocols",
      "Coordinate with relevant departments",
      "Document all actions taken",
      "Report completion to supervisor",
    ]
  )
}

const getRequiredResources = (type: string) => {
  const resources = {
    "Task Assignment": ["Rescue boats", "Life vests", "Ropes and harnesses", "Communication radios", "First aid kits"],
    "Field Report": [
      "Assessment forms",
      "Measuring equipment",
      "Camera for documentation",
      "GPS device",
      "Safety gear",
    ],
    "Resource Request": ["Additional rescue boats", "Marine fuel", "Boat operators", "Safety equipment", "Towing gear"],
    "Team Deployment": [
      "Personal protective equipment",
      "Emergency response kits",
      "Communication devices",
      "Transportation",
      "Medical supplies",
    ],
    "Incident Update": [
      "Monitoring equipment",
      "Assessment tools",
      "Communication devices",
      "Documentation materials",
      "Safety gear",
    ],
    "Meeting Notice": ["Meeting materials", "Projector setup", "Documentation", "Refreshments", "Note-taking supplies"],
    "Equipment Alert": [
      "Replacement vehicle",
      "Repair tools",
      "Diagnostic equipment",
      "Maintenance supplies",
      "Alternative transport",
    ],
  }
  return (
    resources[type as keyof typeof resources] || [
      "Standard equipment",
      "Communication devices",
      "Documentation materials",
      "Safety gear",
    ]
  )
}

const getRelevantContacts = (type: string) => {
  const contacts = {
    "Task Assignment": [
      { name: "Operations Chief Martinez", number: "(02) 8-725-1001", role: "Operations Coordinator" },
      { name: "Team Alpha Leader", number: "(02) 8-725-1002", role: "Field Team Leader" },
      { name: "Barangay Greenhills Captain", number: "(02) 8-725-2001", role: "Local Coordinator" },
    ],
    "Field Report": [
      { name: "Field Officer Santos", number: "(02) 8-725-1003", role: "Field Assessment" },
      { name: "Engineering Office", number: "(02) 8-725-3001", role: "Infrastructure Support" },
      { name: "Public Works Department", number: "(02) 8-725-4001", role: "Drainage Maintenance" },
    ],
    "Resource Request": [
      { name: "Supply Officer Cruz", number: "(02) 8-725-1004", role: "Logistics Coordinator" },
      { name: "Marine Unit Leader", number: "(02) 8-725-1005", role: "Marine Operations" },
      { name: "Fleet Manager", number: "(02) 8-725-5001", role: "Vehicle Coordination" },
    ],
  }
  return (
    contacts[type as keyof typeof contacts] || [
      { name: "CDRRMO Operations Center", number: "(02) 8-725-1000", role: "Main Operations" },
      { name: "Emergency Hotline", number: "8-SAN-JUAN", role: "Emergency Response" },
    ]
  )
}

export default function ShowNotifications() {
  const [notification, setNotification] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [taskStatus, setTaskStatus] = useState("In Progress")
  const [currentTaskStatus, setCurrentTaskStatus] = useState("ACTIVE")
  const [supportRequest, setSupportRequest] = useState("")
  const [supportType, setSupportType] = useState("Personnel")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const urlParts = window.location.pathname.split("/")
    const notificationId = urlParts[urlParts.length - 1]
    const notificationData = getCDRRMOStaffNotificationData(notificationId)
    if (notificationData) {
      setNotification(notificationData)
    }
  }, [])

  const toggleStatus = () => {
    if (!notification) return

    const newStatus = notification.status === "Unread" ? "Checked" : "Unread"

    setNotification((prev) => ({
      ...prev,
      status: newStatus,
    }))

    const savedNotifications = localStorage.getItem("sanjuan_cdrrmo_staff_notifications")
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications)
        const updatedNotifications = notifications.map((n: any) =>
          n.id === notification.id ? { ...n, status: newStatus } : n,
        )
        localStorage.setItem("sanjuan_cdrrmo_staff_notifications", JSON.stringify(updatedNotifications))
      } catch (error) {
        console.error("Error updating notification status:", error)
      }
    }
  }

  const handleBackToNotifications = () => {
    router.visit("/notifications")
  }

  const handleDelete = () => {
    if (!notification) return

    const savedNotifications = localStorage.getItem("sanjuan_cdrrmo_staff_notifications")
    if (savedNotifications) {
      try {
        const notifications = JSON.parse(savedNotifications)
        const updatedNotifications = notifications.filter((n: any) => n.id !== notification.id)
        localStorage.setItem("sanjuan_cdrrmo_staff_notifications", JSON.stringify(updatedNotifications))
      } catch (error) {
        console.error("Error deleting notification:", error)
      }
    }

    router.visit("/notifications")
  }

  const handleUpdateStatus = () => {
    // Save status update
    setCurrentTaskStatus(taskStatus.toUpperCase())
    alert(`Task status updated to: ${taskStatus}`)
    setShowStatusModal(false)
  }

  const handleRequestSupport = () => {
    // Save support request
    alert(`Support request submitted: ${supportType} - ${supportRequest}`)
    setShowSupportModal(false)
    setSupportRequest("")
  }

  const handleGenerateReport = () => {
    if (!notification) return

    // Generate HTML content for Word document
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CDRRMO Incident Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #1B2560; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #1B2560; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .title { color: #1B2560; font-size: 20px; font-weight: bold; }
        .section { margin-bottom: 25px; }
        .section-title { color: #1B2560; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-item { margin-bottom: 10px; }
        .label { font-weight: bold; color: #333; }
        .value { color: #666; }
        .priority-urgent { background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .priority-high { background: #ea580c; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .priority-normal { background: #1B2560; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .priority-low { background: #6b7280; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .status-badge { background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .instructions { background: #f0f9ff; padding: 15px; border-left: 4px solid #1B2560; }
        .resources { display: flex; flex-wrap: wrap; gap: 8px; }
        .resource-tag { background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ccc; padding-top: 20px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">SAN JUAN CITY CDRRMO</div>
        <div class="title">INCIDENT REPORT</div>
        <div style="color: #666; font-size: 14px; margin-top: 10px;">City Disaster Risk Reduction and Management Office</div>
    </div>

    <div class="section">
        <div class="section-title">INCIDENT INFORMATION</div>
        <div class="info-grid">
            <div>
                <div class="info-item">
                    <span class="label">Task ID:</span> 
                    <span class="value">${notification.taskId || "N/A"}</span>
                </div>
                <div class="info-item">
                    <span class="label">Type:</span> 
                    <span class="value">${notification.type}</span>
                </div>
                <div class="info-item">
                    <span class="label">Priority:</span> 
                    <span class="priority-${notification.priority}">${notification.priority.toUpperCase()}</span>
                </div>
                <div class="info-item">
                    <span class="label">Location:</span> 
                    <span class="value">${notification.location}</span>
                </div>
                <div class="info-item">
                    <span class="label">Coordinates:</span> 
                    <span class="value">${notification.coordinates}</span>
                </div>
            </div>
            <div>
                <div class="info-item">
                    <span class="label">Status:</span> 
                    <span class="status-badge">${currentTaskStatus}</span>
                </div>
                <div class="info-item">
                    <span class="label">Reported By:</span> 
                    <span class="value">${notification.reportedBy}</span>
                </div>
                <div class="info-item">
                    <span class="label">Department:</span> 
                    <span class="value">${notification.department}</span>
                </div>
                ${
                  notification.assignedTo
                    ? `
                <div class="info-item">
                    <span class="label">Assigned To:</span> 
                    <span class="value">${notification.assignedTo}</span>
                </div>
                `
                    : ""
                }
                <div class="info-item">
                    <span class="label">Time Issued:</span> 
                    <span class="value">${notification.timestamp}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">INCIDENT TITLE</div>
        <h3 style="color: #1B2560; margin: 10px 0;">${notification.title}</h3>
    </div>

    <div class="section">
        <div class="section-title">DESCRIPTION</div>
        <p style="text-align: justify; color: #333;">${notification.detailedMessage}</p>
    </div>

    <div class="section">
        <div class="section-title">INSTRUCTIONS</div>
        <div class="instructions">
            <ul>
                ${notification.instructions.map((instruction: string) => `<li>${instruction}</li>`).join("")}
            </ul>
        </div>
    </div>

    <div class="section">
        <div class="section-title">REQUIRED RESOURCES</div>
        <div class="resources">
            ${notification.resources.map((resource: string) => `<span class="resource-tag">${resource}</span>`).join("")}
        </div>
    </div>

    {/* Report Attachments */}
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Report Attachments</h3>
      <div className="space-y-4">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            id="attachment-upload"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach(file => {
                console.log('File uploaded:', file.name);
                // Handle file upload logic here
              });
            }}
          />
          <label htmlFor="attachment-upload" className="cursor-pointer">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">Upload Report Attachments</p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB per file)
            </p>
          </label>
        </div>

        {/* Sample Uploaded Files Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2-2v14a2 2 0 002 2z"></path>
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">incident_report_photos.pdf</p>
                <p className="text-xs text-gray-500">2.3 MB • Uploaded 5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">flood_damage_assessment.jpg</p>
                <p className="text-xs text-gray-500">1.8 MB • Uploaded 10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
              <button className="p-1 text-gray-400 hover:text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Upload Guidelines */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Upload Guidelines</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Include photos of incident scene, damage assessment, and response activities</li>
            <li>• Upload completed forms, witness statements, and official documents</li>
            <li>• Ensure all files are clearly named and relevant to this incident</li>
            <li>• Maximum file size: 10MB per file</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
        <div><strong>Report Generated:</strong> ${new Date().toLocaleString()}</div>
        <div style="margin-top: 10px;">
            <strong>San Juan City CDRRMO</strong><br>
            Emergency Operations Center<br>
            Contact: (02) 8-725-1000 | Emergency Hotline: 8-SAN-JUAN
        </div>
    </div>
</body>
</html>
    `

    // Create and download the Word document
    const blob = new Blob([htmlContent], { type: "application/msword" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `CDRRMO_Report_${notification.taskId || notification.id}_${new Date().toISOString().split("T")[0]}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-700 text-white"
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

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-600"
      case "IN PROGRESS":
        return "bg-blue-600"
      case "ON HOLD":
        return "bg-orange-600"
      case "COMPLETED":
        return "bg-green-600"
      case "CANCELLED":
        return "bg-red-600"
      default:
        return "bg-orange-600" // ACTIVE
    }
  }

  if (!notification) {
    return (
      <div className="py-6">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Notification not found</h2>
            <button
              onClick={handleBackToNotifications}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Notifications
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBackToNotifications}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to Notifications
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>CDRRMO Staff Portal</span>
            <span>›</span>
            <span>Internal Notifications</span>
            <span>›</span>
            <span>Task Details</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6"
                style={{ color: "#1B2560" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
              <h1 className="text-2xl font-semibold">Staff Task Details</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleStatus}
                className="flex items-center gap-2 px-4 py-2 text-white rounded hover:opacity-90"
                style={{ backgroundColor: "#1B2560" }}
              >
                {notification.status === "Unread" ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Mark as Read
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-5 5-5-5h5v-12"
                      ></path>
                    </svg>
                    Mark as Unread
                  </>
                )}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Archive
              </button>
            </div>
          </div>
        </div>

        {/* Main Task Information Box */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Task Header */}
          <div className="p-6 border-b border-gray-200" style={{ backgroundColor: "#1B2560" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${getPriorityBadgeColor(notification.priority)}`}
                  style={{
                    backgroundColor: notification.priority === "normal" ? "#dc2626" : undefined,
                  }}
                >
                  {notification.priority} priority
                </span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded font-medium">
                  {notification.type}
                </span>
                {notification.taskId && (
                  <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded font-mono">
                    {notification.taskId}
                  </span>
                )}
                <h2 className="text-xl font-semibold text-white">{notification.title}</h2>
              </div>
              <div className="text-sm text-blue-100">
                {currentTime.toLocaleString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          {/* Task Content */}
          <div className="p-6 space-y-6">
            {/* Task Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Task ID</label>
                  <p className="text-base font-medium text-gray-900">{notification.taskId || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-base text-gray-900">{notification.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Coordinates</label>
                  <p className="text-base font-mono text-gray-900">{notification.coordinates}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reported By</label>
                  <p className="text-base text-gray-900">{notification.reportedBy}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Task Status</label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium text-white ${getTaskStatusColor(currentTaskStatus)}`}
                    >
                      {currentTaskStatus}
                    </span>
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
                <div>
                  <label className="text-sm font-medium text-gray-500">Time Issued</label>
                  <p className="text-base text-gray-900">{notification.timestamp}</p>
                  <p className="text-sm text-gray-500">({notification.timeAgo})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-base text-gray-900">{notification.department}</p>
                </div>
                {notification.assignedTo && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned To</label>
                    <p className="text-base font-medium text-blue-600">{notification.assignedTo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Task Description */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Task Description</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">{notification.detailedMessage}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Instructions</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <ul className="space-y-2">
                  {notification.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                      <span className="text-blue-600 mt-1">•</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Required Resources */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Required Resources</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {notification.resources.map((resource: string, index: number) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-medium">
                    {resource}
                  </span>
                ))}
              </div>
            </div>

            {/* Report Attachments - Only show if files are uploaded */}
            {uploadedFiles.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Report Attachments</h3>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {file.size} • Uploaded {file.uploadTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            const newFiles = uploadedFiles.filter((_, i) => i !== index)
                            setUploadedFiles(newFiles)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Request Support
                </button>
                <button
                  onClick={() => setShowMapModal(true)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Location Map
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Generate Report
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Upload Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Update Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Task Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpdateStatus}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Support Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Request Additional Support</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Type</label>
                  <select
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Personnel">Additional Personnel</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Medical">Medical Support</option>
                    <option value="Technical">Technical Assistance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Details</label>
                  <textarea
                    value={supportRequest}
                    onChange={(e) => setSupportRequest(e.target.value)}
                    placeholder="Describe what support you need and why..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleRequestSupport}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit Request
                  </button>
                  <button
                    onClick={() => setShowSupportModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom San Juan City Map Modal */}
        {showMapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-6xl h-5/6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">San Juan City Emergency Map</h3>
                <button onClick={() => setShowMapModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Map Header Info */}
              <div className="mb-4">
                <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{notification.location}</h4>
                      <p className="text-sm text-gray-600">Coordinates: {notification.coordinates}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        INCIDENT LOCATION
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium text-white ${getTaskStatusColor(currentTaskStatus)}`}
                      >
                        {currentTaskStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Container - Ready for Implementation */}
              <div className="h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <h4 className="text-lg font-medium text-gray-500 mb-2">Map Implementation Area</h4>
                  <p className="text-gray-400 mb-4">San Juan City Emergency Map will be integrated here</p>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 max-w-md mx-auto">
                    <h5 className="font-medium text-gray-700 mb-2">Map Features to Implement:</h5>
                    <ul className="text-sm text-gray-600 space-y-1 text-left">
                      <li>• Interactive San Juan City map</li>
                      <li>• Real-time incident markers</li>
                      <li>• Emergency resource locations</li>
                      <li>• Team deployment tracking</li>
                      <li>• Route planning and navigation</li>
                    </ul>
                  </div>
                </div>

                {/* Map Controls Panel */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white rounded-lg shadow-lg p-3 space-y-2 border border-gray-200">
                    <button className="block w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      Center on Incident
                    </button>
                    <button className="block w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                      Show Route to HQ
                    </button>
                    <button className="block w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                      Nearby Resources
                    </button>
                    <button className="block w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                      Traffic Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Report Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Report Attachments</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="modal-attachment-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      const newFiles = files.map((file) => ({
                        name: file.name,
                        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                        uploadTime: "just now",
                        file: file,
                      }))
                      setUploadedFiles((prev) => [...prev, ...newFiles])
                      setShowUploadModal(false)
                    }}
                  />
                  <label htmlFor="modal-attachment-upload" className="cursor-pointer">
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-2">Upload Report Attachments</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

ShowNotifications.layout = (e: JSX.Element) => <Authenticated children={e} />