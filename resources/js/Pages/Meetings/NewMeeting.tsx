"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, MapPin, Video, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Real-time clock hook
function useRealTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDateTime = (date: Date) => {
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
    return date.toLocaleDateString("en-US", options)
  }

  return formatDateTime(currentTime)
}

// Simple select component as fallback
const SimpleSelect = ({
  value,
  onValueChange,
  children,
  placeholder,
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  placeholder?: string
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {children}
  </select>
)

const SimpleSelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
)

interface NewMeetingProps {
  onNavigateBack?: () => void
}

export default function NewMeeting({ onNavigateBack }: NewMeetingProps = {}) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    priority: "",
    department: "",
    location: "",
    date: "",
    time: "",
    duration: "",
    description: "",
    meetingFormat: "in-person",
    meetingLink: "",
    meetingId: "",
    passcode: "",
    sendNotification: true,
  })

  const [agenda, setAgenda] = useState<string[]>([""])

  const addAgendaItem = () => {
    setAgenda([...agenda, ""])
  }

  const removeAgendaItem = (index: number) => {
    if (agenda.length > 1) {
      setAgenda(agenda.filter((_, i) => i !== index))
    }
  }

  const updateAgendaItem = (index: number, value: string) => {
    const newAgenda = [...agenda]
    newAgenda[index] = value
    setAgenda(newAgenda)
  }

  const currentDateTime = useRealTimeClock()

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBack = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      // Fallback navigation
      window.history.back()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (
      !formData.title ||
      !formData.type ||
      !formData.priority ||
      !formData.department ||
      !formData.date ||
      !formData.time ||
      !formData.description
    ) {
      alert("Please fill in all required fields.")
      return
    }

    // Validate meeting format specific fields
    if (formData.meetingFormat === "in-person" && !formData.location) {
      alert("Please enter a meeting location for in-person meetings.")
      return
    }

    if (formData.meetingFormat !== "in-person" && !formData.meetingLink) {
      alert("Please enter a meeting link for virtual meetings.")
      return
    }

    // Store the meeting data in localStorage so it persists across page navigation
    const existingMeetings = JSON.parse(localStorage.getItem("newMeetings") || "[]")
    const newMeetingData = {
      ...formData,
      agenda: agenda.filter((item) => item.trim() !== ""),
      createdAt: new Date().toISOString(),
    }
    existingMeetings.push(newMeetingData)
    localStorage.setItem("newMeetings", JSON.stringify(existingMeetings))

    // Also try to add to the global function if it exists - pass the complete newMeetingData
    if ((window as any).addNewMeeting) {
      ;(window as any).addNewMeeting(newMeetingData)
    }

    alert(`Meeting "${formData.title}" created successfully!`)

    // Navigate back to list after successful creation
    handleBack()
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
      handleBack()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-50 bg-[#1B2560] px-4 md:px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Meetings
            </Button>
          </div>
          <div className="text-right">
            <div className="text-sm font-mono text-white">{currentDateTime}</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-300">CDRRMO Staff Portal › Meetings › Create New Meeting</div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#1B2560] flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#1B2560]" />
            Create New Meeting
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <Users className="w-5 h-5" />
                Meeting Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700 font-medium">
                    Meeting Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter meeting title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-700 font-medium">
                    Meeting Type *
                  </Label>
                  <SimpleSelect
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                    placeholder="Select type"
                  >
                    <SimpleSelectItem value="team-meeting">Team Meeting</SimpleSelectItem>
                    <SimpleSelectItem value="training">Training Session</SimpleSelectItem>
                    <SimpleSelectItem value="planning">Planning Meeting</SimpleSelectItem>
                    <SimpleSelectItem value="briefing">Emergency Briefing</SimpleSelectItem>
                    <SimpleSelectItem value="drill">Drill Exercise</SimpleSelectItem>
                  </SimpleSelect>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-gray-700 font-medium">
                    Priority Level *
                  </Label>
                  <SimpleSelect
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                    placeholder="Select priority"
                  >
                    <SimpleSelectItem value="urgent">🔴 URGENT</SimpleSelectItem>
                    <SimpleSelectItem value="normal">🔵 NORMAL</SimpleSelectItem>
                  </SimpleSelect>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700 font-medium">
                    Department *
                  </Label>
                  <SimpleSelect
                    value={formData.department}
                    onValueChange={(value) => handleInputChange("department", value)}
                    placeholder="Select department"
                  >
                    <SimpleSelectItem value="emergency">Emergency Operations</SimpleSelectItem>
                    <SimpleSelectItem value="admin">Administration</SimpleSelectItem>
                    <SimpleSelectItem value="community">Community Relations</SimpleSelectItem>
                    <SimpleSelectItem value="training">Training & Development</SimpleSelectItem>
                    <SimpleSelectItem value="logistics">Logistics</SimpleSelectItem>
                  </SimpleSelect>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-medium">
                  Meeting Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the meeting agenda, objectives, and any preparation required..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                  className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Meeting Format */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <Video className="w-5 h-5" />
                Meeting Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-4">
                <Label className="text-gray-700 font-medium">Meeting Format *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.meetingFormat === "in-person"
                        ? "border-[#1B2560] bg-[#1B2560]/5 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleInputChange("meetingFormat", "in-person")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-[#1B2560]" />
                      <span className="font-medium text-gray-900">In-Person</span>
                    </div>
                    <p className="text-sm text-gray-600">Physical meeting at a location</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.meetingFormat === "zoom"
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleInputChange("meetingFormat", "zoom")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Zoom Meeting</span>
                    </div>
                    <p className="text-sm text-gray-600">Virtual meeting via Zoom</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      formData.meetingFormat === "google-meet"
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleInputChange("meetingFormat", "google-meet")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">Google Meet</span>
                    </div>
                    <p className="text-sm text-gray-600">Virtual meeting via Google Meet</p>
                  </div>
                </div>
              </div>

              {formData.meetingFormat === "in-person" ? (
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">
                    Meeting Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter physical location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meetingLink" className="text-gray-700 font-medium">
                      Meeting Link *
                    </Label>
                    <Input
                      id="meetingLink"
                      placeholder={`Enter ${formData.meetingFormat === "zoom" ? "Zoom" : "Google Meet"} link`}
                      value={formData.meetingLink}
                      onChange={(e) => handleInputChange("meetingLink", e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                    />
                  </div>

                  {formData.meetingFormat === "zoom" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meetingId" className="text-gray-700 font-medium">
                          Meeting ID
                        </Label>
                        <Input
                          id="meetingId"
                          placeholder="123 456 7890"
                          value={formData.meetingId}
                          onChange={(e) => handleInputChange("meetingId", e.target.value)}
                          className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passcode" className="text-gray-700 font-medium">
                          Passcode
                        </Label>
                        <Input
                          id="passcode"
                          placeholder="Meeting passcode"
                          value={formData.passcode}
                          onChange={(e) => handleInputChange("passcode", e.target.value)}
                          className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <Clock className="w-5 h-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-700 font-medium">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-700 font-medium">
                    Time *
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-700 font-medium">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    min="15"
                    max="480"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={formData.sendNotification}
                  onChange={(e) => handleInputChange("sendNotification", e.target.checked)}
                  className="rounded border-gray-300 text-[#1B2560] focus:ring-[#1B2560]"
                />
                <Label htmlFor="notifications" className="text-gray-700">
                  Send notification to all department members
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Meeting Agenda */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <Calendar className="w-5 h-5" />
                Meeting Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">Agenda Items</Label>
                {agenda.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="bg-[#1B2560] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <Input
                      placeholder={`Agenda item ${index + 1}`}
                      value={item}
                      onChange={(e) => updateAgendaItem(index, e.target.value)}
                      className="flex-1 border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                    />
                    {agenda.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAgendaItem(index)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAgendaItem}
                  className="w-full border-[#1B2560] text-[#1B2560] hover:bg-[#1B2560]/5"
                >
                  + Add Agenda Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white shadow-sm">
              Create Meeting
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

NewMeeting.layout = (e: JSX.Element) => <Authenticated children={e} />
