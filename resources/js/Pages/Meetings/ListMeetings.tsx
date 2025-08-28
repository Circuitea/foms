"use client"

import { Bell, MoreVertical, MapPin, Video, Check, Copy, ExternalLink, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { useEffect, type JSX } from "react"
import { Link } from "@inertiajs/react"
import { userHasPermission } from "@/lib/utils"
import { Meeting } from "@/types/meetings"
import { PageProps } from "@/types"
import { useRealTimeClock } from "@/hooks/use-clock"
import dayjs from "dayjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function ListMeetings({ activeMeetings, finishedMeetings }: PageProps<{ activeMeetings: Meeting[], finishedMeetings: Meeting[] }>) {
  return (
    <Tabs defaultValue="active">
      <TabsList className="border-b w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          {[{name: 'Active Meetings', value: 'active', count: activeMeetings.length}, {name: 'Finished Meetings', value: 'finished', count: finishedMeetings.length}].map((tab)=> (
            <TabsTrigger value={tab.value}>
              {tab.name} ({tab.count})
            </TabsTrigger>
          ))}
        </div>
        <div className="flex">
          {userHasPermission(/meetings\.(?:create|\*)/) && (
            <Button className="bg-white text-[#1B2560] hover:bg-gray-100" asChild>
              <Link href="/meetings/new">New Meeting</Link>
            </Button>
          )}
        </div>
      </TabsList>
      <TabsContent value="active">
        <div className="container mx-auto px-4 md:px-6 py-6 space-y-4">
          {activeMeetings.map((meeting) => (
            <Link href={`/meetings/${meeting.id}`}>
            <Card
              key={meeting.id}
              className="p-0 overflow-hidden bg-white border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
              <div className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  {/* Status indicator */}
                  <div
                    className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      meeting.status === "Active" ? "bg-[#1B2560] animate-pulse" : "bg-gray-400"
                    }`}
                  ></div>

                  <div className="flex-1 min-w-0">
                    {/* Priority and type badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold text-white rounded ${
                          meeting.priority === "urgent" ? "bg-red-600 animate-pulse" : "bg-[#1B2560]"
                        }`}
                        >
                        {meeting.priority.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-gray-600">
                        {meeting.format_type === "in_person_meeting" ? (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{meeting.type.name}</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4" />
                            <span className="text-sm">{meeting.type.name}</span>
                          </>
                        )}
                      </div>
                      {/* <span className="text-sm text-gray-500">{meeting.meetingId}</span> */}
                      <span
                        className={`px-2 py-1 text-xs border rounded ${
                          meeting.format_type === "in_person_meeting"
                            ? "border-[#1B2560] text-[#1B2560] bg-[#1B2560]/5"
                            : meeting.format_type === "zoom_meeting"
                              ? "border-blue-500 text-blue-700 bg-blue-50"
                              : "border-green-500 text-green-700 bg-green-50"
                        }`}
                      >
                        {meeting.format_type === "in_person_meeting"
                          ? "In-Person"
                          : meeting.format_type === "zoom_meeting"
                            ? "Zoom"
                            : "Google Meet"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-[#1B2560] transition-colors">
                      {meeting.title}
                    </h3>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4">
                        {meeting.format_type === 'in_person_meeting' && (
                          <span>
                            <span className="font-medium">Location:</span> {meeting.format.meeting_location}
                          </span>
                        )}
                        <span>
                          <span className="font-medium">Department:</span> {meeting.section.name}
                        </span>
                        <span>
                          <span className="font-medium">Organized by:</span> {meeting.organizer.first_name}
                        </span>
                      </div>
                      {/* <div>
                        <span className="font-medium">Assigned to:</span>
                        <span className="text-[#1B2560] ml-1">{meeting.assignedTo}</span>
                        </div> */}
                    </div>

                    {/* Time and status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>{dayjs(meeting.schedule).format('MMM DD, YYYY - hh:mm A')}</span>
                        <span>({dayjs(meeting.schedule).fromNow()})</span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            meeting.status === "Active" ? "bg-[#1B2560] text-white"
                            : meeting.status === 'Ongoing' ? "bg-green-400 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                          >
                          {meeting.status}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {meeting.status === "Active" && (
                            <DropdownMenuItem>
                              <Check className="w-4 h-4 mr-2" />
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Join meeting
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
          ))}
          {activeMeetings.length === 0 && (
            <div className="w-full flex justify-center items-center">
              No Active Meetings found.
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="finished">
        <div className="container mx-auto px-4 md:px-6 py-6 space-y-4">
          {finishedMeetings.map((meeting) => (
            <Link href={`/meetings/${meeting.id}`}>
            <Card
              key={meeting.id}
              className="p-0 overflow-hidden bg-white border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
              <div className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  {/* Status indicator */}
                  <div
                    className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      meeting.status === "Active" ? "bg-[#1B2560] animate-pulse" : "bg-gray-400"
                    }`}
                  ></div>

                  <div className="flex-1 min-w-0">
                    {/* Priority and type badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold text-white rounded ${
                          meeting.priority === "urgent" ? "bg-red-600 animate-pulse" : "bg-[#1B2560]"
                        }`}
                        >
                        {meeting.priority.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1 text-gray-600">
                        {meeting.format_type === "in_person_meeting" ? (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{meeting.type.name}</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4" />
                            <span className="text-sm">{meeting.type.name}</span>
                          </>
                        )}
                      </div>
                      {/* <span className="text-sm text-gray-500">{meeting.meetingId}</span> */}
                      <span
                        className={`px-2 py-1 text-xs border rounded ${
                          meeting.format_type === "in_person_meeting"
                            ? "border-[#1B2560] text-[#1B2560] bg-[#1B2560]/5"
                            : meeting.format_type === "zoom_meeting"
                              ? "border-blue-500 text-blue-700 bg-blue-50"
                              : "border-green-500 text-green-700 bg-green-50"
                        }`}
                      >
                        {meeting.format_type === "in_person_meeting"
                          ? "In-Person"
                          : meeting.format_type === "zoom_meeting"
                            ? "Zoom"
                            : "Google Meet"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-[#1B2560] transition-colors">
                      {meeting.title}
                    </h3>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4">
                        {meeting.format_type === 'in_person_meeting' && (
                          <span>
                            <span className="font-medium">Location:</span> {meeting.format.meeting_location}
                          </span>
                        )}
                        <span>
                          <span className="font-medium">Department:</span> {meeting.section.name}
                        </span>
                        <span>
                          <span className="font-medium">Organized by:</span> {meeting.organizer.first_name}
                        </span>
                      </div>
                      {/* <div>
                        <span className="font-medium">Assigned to:</span>
                        <span className="text-[#1B2560] ml-1">{meeting.assignedTo}</span>
                        </div> */}
                    </div>

                    {/* Time and status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <span>{dayjs(meeting.schedule).format('MMM DD, YYYY - hh:mm A')}</span>
                        <span>({dayjs(meeting.schedule).fromNow()})</span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            meeting.status === "Active" ? "bg-[#1B2560] text-white"
                            : meeting.status === 'Ongoing' ? "bg-green-400 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                          >
                          {meeting.status}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {meeting.status === "Active" && (
                            <DropdownMenuItem>
                              <Check className="w-4 h-4 mr-2" />
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Join meeting
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
          ))}
          {finishedMeetings.length === 0 && (
            <div className="w-full flex justify-center items-center">
              No Finished Meetings found.
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

ListMeetings.layout = (e: JSX.Element) => <Authenticated PageIcon={Phone} pageTitle="Meetings" children={e} />
