"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Calendar, MapPin, Video, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { JSX } from "react"

export default function NewMeeting() {
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBack = () => {
    alert("Back to Meetings")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Meeting Created Successfully!")
    console.log("Meeting data:", formData)
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
      alert("Meeting creation cancelled")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Meetings
          </Button>
        </div>
        <div className="mt-2 text-sm text-gray-500">CDRRMO Staff Portal › Meetings › Create New Meeting</div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#1B2560]" />
            Create New Meeting
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <Users className="w-5 h-5" />
                Meeting Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter meeting title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Meeting Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team-meeting">Team Meeting</SelectItem>
                      <SelectItem value="training">Training Session</SelectItem>
                      <SelectItem value="planning">Planning Meeting</SelectItem>
                      <SelectItem value="briefing">Emergency Briefing</SelectItem>
                      <SelectItem value="drill">Drill Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level *</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">URGENT</SelectItem>
                      <SelectItem value="normal">NORMAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Emergency Operations</SelectItem>
                      <SelectItem value="admin">Administration</SelectItem>
                      <SelectItem value="community">Community Relations</SelectItem>
                      <SelectItem value="training">Training & Development</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Meeting Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the meeting agenda, objectives, and any preparation required..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Meeting Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <Video className="w-5 h-5" />
                Meeting Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Meeting Format *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.meetingFormat === "in-person"
                        ? "border-[#1B2560] bg-[#1B2560]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("meetingFormat", "in-person")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-[#1B2560]" />
                      <span className="font-medium">In-Person</span>
                    </div>
                    <p className="text-sm text-gray-600">Physical meeting at a location</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.meetingFormat === "zoom"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("meetingFormat", "zoom")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Zoom Meeting</span>
                    </div>
                    <p className="text-sm text-gray-600">Virtual meeting via Zoom</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.meetingFormat === "google-meet"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleInputChange("meetingFormat", "google-meet")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Google Meet</span>
                    </div>
                    <p className="text-sm text-gray-600">Virtual meeting via Google Meet</p>
                  </div>
                </div>
              </div>

              {formData.meetingFormat === "in-person" ? (
                <div className="space-y-2">
                  <Label htmlFor="location">Meeting Location *</Label>
                  <Input
                    id="location"
                    placeholder="Enter physical location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meetingLink">Meeting Link *</Label>
                    <Input
                      id="meetingLink"
                      placeholder={`Enter ${formData.meetingFormat === "zoom" ? "Zoom" : "Google Meet"} link`}
                      value={formData.meetingLink}
                      onChange={(e) => handleInputChange("meetingLink", e.target.value)}
                      required
                    />
                  </div>

                  {formData.meetingFormat === "zoom" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meetingId">Meeting ID</Label>
                        <Input
                          id="meetingId"
                          placeholder="123 456 7890"
                          value={formData.meetingId}
                          onChange={(e) => handleInputChange("meetingId", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passcode">Passcode</Label>
                        <Input
                          id="passcode"
                          placeholder="Meeting passcode"
                          value={formData.passcode}
                          onChange={(e) => handleInputChange("passcode", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1B2560]">
                <Clock className="w-5 h-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    min="15"
                    max="480"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={formData.sendNotification}
                  onChange={(e) => handleInputChange("sendNotification", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="notifications">Send notification to all department members</Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1B2560] hover:bg-[#1B2560]/80 text-white">
              Create Meeting
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

NewMeeting.layout = (e: JSX.Element) => <Authenticated children={e} />
