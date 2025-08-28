"use client"

import type React from "react"
import { useState, useEffect, FormEventHandler } from "react"
import { ArrowLeft, MapPin, Video, Users, Clock, ChevronDown, CalendarIcon, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "laravel-precognition-react-inertia"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageProps, Section } from "@/types"
import { MeetingFormatType, MeetingPriority, MeetingType } from "@/types/meetings"
import { Link } from "@inertiajs/react"
import { toProperCase } from "@/lib/utils"
import { Popover, PopoverTrigger } from "@radix-ui/react-popover"
import { PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import toast from "@/components/toast"
import { useRealTimeClock } from "@/hooks/use-clock"

export default function NewMeeting({ types, sections }: PageProps<{ types: MeetingType[], sections: Section[] }>) {
  const defaultDate = new Date()
  defaultDate.setSeconds(0);

  const form = useForm<{
    title: string,
    type: number,
    priority?: MeetingPriority,
    section: number,
    description: string,

    meetingFormat: MeetingFormatType
    meetingLocation: string,
    meetingLink: string,
    meetingID: string,
    meetingPasscode: string,

    sendNotification: boolean,

    agendas: string[],

    dateTime: Date,
    duration: number,
  }>('post', route('meetings.create'), {
    title: '',
    type: 0,
    section: 0,
    description: '',

    meetingFormat: 'in_person_meeting',
    meetingLocation: '',
    meetingLink: '',
    meetingID: '',
    meetingPasscode: '',

    sendNotification: false,

    agendas: [''],

    dateTime: defaultDate,
    duration: 60,
  });

  const [ isDatePickerOpen, setDatePickerOpen ] = useState(false);

  const currentDateTime = useRealTimeClock()
  
  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    form.submit({
      onFinish: () => form.reset(),
      // @ts-ignore
      onError: (err) => toast('error', 'Submission Error', err),
    });
  }

  return (
    <>
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-[#1B2560] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#1B2560]" />
            Create New Meeting
          </h1>
        </div>

        <form onSubmit={submit} className="space-y-6">
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
                    value={form.data.title}
                    onChange={(e) => form.setData("title", e.target.value)}
                    onBlur={() => form.validate('title')}
                    required
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                  {form.invalid("title") && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{form.errors.title}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-gray-700 font-medium">
                    Meeting Type *
                  </Label>
                  <Select onValueChange={(newType) => form.setData('type', parseInt(newType))}>
                    <SelectTrigger className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.invalid("type") && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{form.errors.type}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-gray-700 font-medium">
                    Priority Level *
                  </Label>
                  <Select onValueChange={(newPriority: MeetingPriority) => form.setData('priority', newPriority)} defaultValue="">
                    <SelectTrigger className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='normal'>Normal</SelectItem>
                        <SelectItem value='urgent'>Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.invalid("priority") && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{form.errors.priority}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-gray-700 font-medium">
                    Section *
                  </Label>
                  <Select onValueChange={(newVal) => form.setData('section', parseInt(newVal))}>
                    <SelectTrigger className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem value={section.id.toString()}>{section.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.invalid("section") && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{form.errors.section}</span>
                    </div>
                  )}
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
                  value={form.data.description}
                  onChange={(e) => form.setData("description", e.target.value)}
                  onBlur={() => form.validate('description')}
                  required
                  className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                />
                {form.invalid("description") && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{form.errors.description}</span>
                    </div>
                  )}
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
                      form.data.meetingFormat === "in_person_meeting"
                        ? "border-[#1B2560] bg-[#1B2560]/5 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => form.setData("meetingFormat", "in_person_meeting")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-[#1B2560]" />
                      <span className="font-medium text-gray-900">In-Person</span>
                    </div>
                    <p className="text-sm text-gray-600">Physical meeting at a location</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      form.data.meetingFormat === "zoom_meeting"
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => form.setData("meetingFormat", "zoom_meeting")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Zoom Meeting</span>
                    </div>
                    <p className="text-sm text-gray-600">Virtual meeting via Zoom</p>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      form.data.meetingFormat === "google_meeting"
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => form.setData("meetingFormat", "google_meeting")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900">Google Meet</span>
                    </div>
                    <p className="text-sm text-gray-600">Virtual meeting via Google Meet</p>
                  </div>
                </div>
              </div>

              {form.data.meetingFormat === "in_person_meeting" ? (
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">
                    Meeting Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter physical location"
                    value={form.data.meetingLocation}
                    onChange={(e) => form.setData("meetingLocation", e.target.value)}
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
                      placeholder={`Enter ${form.data.meetingFormat === "zoom_meeting" ? "Zoom" : "Google Meet"} link`}
                      value={form.data.meetingLink}
                      onChange={(e) => form.setData("meetingLink", e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                    />
                  </div>

                  {form.data.meetingFormat === "zoom_meeting" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meetingId" className="text-gray-700 font-medium">
                          Meeting ID
                        </Label>
                        <Input
                          id="meetingId"
                          placeholder="123 456 7890"
                          value={form.data.meetingID}
                          onChange={(e) => form.setData("meetingID", e.target.value)}
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
                          value={form.data.meetingPasscode}
                          onChange={(e) => form.setData("meetingPasscode", e.target.value)}
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
                  <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        className="w-full bg-white text-black border-gray-300 focus:border-[#1B2560] focus:ring-[$1B2560] justify-between hover:bg-gray-50"
                      >
                        {form.data.dateTime.toDateString()}
                        <ChevronDown />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar 
                        mode="single"
                        selected={form.data.dateTime}
                        onSelect={(date) => {
                          const newDate = new Date(form.data.dateTime)
                          if (date) {
                            newDate.setMonth(date.getMonth(), date.getDate());
                          }
                          form.setData('dateTime', newDate);
                          setDatePickerOpen(false);
                        }}  
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-gray-700 font-medium">
                    Time *
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.data.dateTime.toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const [ hours, minutes ] = e.target.value.split(':');
                      const newDate = new Date(form.data.dateTime);
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      form.setData('dateTime', newDate);
                    }}
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
                    value={form.data.duration}
                    onChange={(e) => form.setData("duration", parseInt(e.target.value))}
                    className="border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={form.data.sendNotification}
                  onChange={(e) => form.setData("sendNotification", e.target.checked)}
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
                <CalendarIcon className="w-5 h-5" />
                Meeting Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium">Agenda Items</Label>
                {form.data.agendas.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="bg-[#1B2560] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <Input
                      placeholder={`Agenda item ${index + 1}`}
                      value={item}
                      onChange={(e) => {
                        const agendas = form.data.agendas;
                        agendas[index] = e.target.value;
                        form.setData('agendas', agendas);
                      }}
                      required
                      className="flex-1 border-gray-300 focus:border-[#1B2560] focus:ring-[#1B2560]"
                    />
                    {form.data.agendas.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {form.setData('agendas', form.data.agendas.filter((_, i) => i !== index))}}
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
                  onClick={() => form.setData('agendas', [...form.data.agendas, ''])}
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
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              asChild
            >
              <Link href='/meetings'>
                Cancel
              </Link>
            </Button>
            <Button disabled={form.processing} type="submit" className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white shadow-sm">
              Create Meeting
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

NewMeeting.layout = (e: JSX.Element) => <Authenticated PageIcon={CalendarIcon} pageTitle="New Meeting" children={e} />
