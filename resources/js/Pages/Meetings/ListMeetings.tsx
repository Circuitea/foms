"use client"

import { Bell, MoreVertical, MapPin, Video, Check, Copy, ExternalLink } from "lucide-react"
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
  const currentDateTime = useRealTimeClock()

  // // Store scroll position
  // const [scrollPosition, setScrollPosition] = useState(0)
  // const detailsContainerRef = useRef<HTMLDivElement>(null)

  // const handleMarkAllRead = () => {
  //   setMeetingsData((prev) => {
  //     const newMeetings = prev.map((meeting) => ({
  //       ...meeting,
  //       status: meeting.status === "Active" ? "Checked" : meeting.status,
  //     }))
  //     saveMeetingStatuses(newMeetings)
  //     return newMeetings
  //   })
  //   alert("All meetings marked as read")
  // }

  // const handleMeetingClick = (meeting: Meeting) => {
  //   // Create updated meeting object if it's currently Active (unread)
  //   let updatedMeeting = meeting
  //   if (meeting.status === "Active") {
  //     updatedMeeting = { ...meeting, status: "Checked" }

  //     // Update the meetings data state
  //     setMeetingsData((prev) => {
  //       const newMeetings = prev.map((m) => (m.id === meeting.id ? updatedMeeting : m))
  //       saveMeetingStatuses(newMeetings)
  //       return newMeetings
  //     })
  //   }

  //   // Save current scroll position before showing meeting details
  //   setScrollPosition(window.scrollY)

  //   // Set the selected meeting with the updated status
  //   setSelectedMeeting(updatedMeeting)

  //   // Only reset scroll for the details container
  //   if (detailsContainerRef.current) {
  //     detailsContainerRef.current.scrollTop = 0
  //   }
  // }

  // const handleBackToList = () => {
  //   setSelectedMeeting(null)

  //   // Restore previous scroll position with a slight delay to ensure rendering
  //   setTimeout(() => {
  //     window.scrollTo({ top: scrollPosition })
  //   }, 0)
  // }

  // // Function to mark a meeting as read
  // const handleMarkAsRead = (meetingId: string, event: React.MouseEvent) => {
  //   event.stopPropagation()
  //   // @ts-ignore
  //   setMeetingsData((prev) => {
  //     const newMeetings = prev.map((meeting) =>
  //       meeting.meetingId === meetingId ? { ...meeting, status: "Checked" } : meeting,
  //     )
  //     // @ts-ignore
  //     saveMeetingStatuses(newMeetings)
  //     return newMeetings
  //   })

  //   // Update selectedMeeting if it's the same meeting
  //   if (selectedMeeting?.meetingId === meetingId) {
  //     setSelectedMeeting((prev) => (prev ? { ...prev, status: "Checked" } : null))
  //   }

  //   alert("Meeting marked as read")
  // }

  // // Function to join a meeting
  // const handleJoinMeeting = (meeting: Meeting, event: React.MouseEvent) => {
  //   event.stopPropagation()

  //   if (meeting.meetingFormat === "in-person") {
  //     alert(`Location: ${meeting.location}`)
  //     return
  //   }

  //   if (meeting.meetingLink) {
  //     window.open(meeting.meetingLink, "_blank")
  //     alert("Opening meeting link in a new tab")
  //   } else {
  //     alert("No meeting link available")
  //   }
  // }

  // // Function to copy meeting link
  // const handleCopyLink = (meeting: Meeting, event: React.MouseEvent) => {
  //   event.stopPropagation()

  //   if (meeting.meetingFormat === "in-person") {
  //     navigator.clipboard.writeText(`In-person meeting at ${meeting.location}`)
  //     alert("Location information copied to clipboard")
  //     return
  //   }

  //   if (meeting.meetingLink) {
  //     navigator.clipboard.writeText(meeting.meetingLink)
  //     alert("Meeting link copied to clipboard")
  //   } else {
  //     alert("No meeting link available to copy")
  //   }
  // }

  // // Function to add a new meeting
  // const addNewMeeting = (newMeetingData: any) => {
  //   const now = new Date()
  //   const timeString = now.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   })

  //   // Generate new meeting ID
  //   const newId = Math.max(...meetingsData.map((m) => m.id)) + 1
  //   const meetingIdNumber = String(newId).padStart(3, "0")

  //   // Map form data to meeting format
  //   const departmentMap: { [key: string]: string } = {
  //     emergency: "Emergency Operations",
  //     admin: "Administration",
  //     community: "Community Relations",
  //     training: "Training & Development",
  //     logistics: "Logistics",
  //   }

  //   const typeMap: { [key: string]: string } = {
  //     "team-meeting": "Team Meeting",
  //     training: "Training Session",
  //     planning: "Planning Meeting",
  //     briefing: "Emergency Briefing",
  //     drill: "Drill Exercise",
  //   }

  //   const newMeeting: Meeting = {
  //     id: newId,
  //     priority: newMeetingData.priority === "urgent" ? "URGENT" : "NORMAL",
  //     type: typeMap[newMeetingData.type] || newMeetingData.type,
  //     meetingId: `MTG-2025-${meetingIdNumber}`,
  //     title: newMeetingData.title,
  //     location: newMeetingData.meetingFormat === "in-person" ? newMeetingData.location : "Virtual Meeting",
  //     department: departmentMap[newMeetingData.department] || newMeetingData.department,
  //     reportedBy: "Current User", // You can replace this with actual user data
  //     assignedTo: "Team Members", // You can replace this with actual assignment logic
  //     time: timeString,
  //     timeAgo: "Just now",
  //     status: "Active",
  //     meetingFormat: newMeetingData.meetingFormat,
  //     meetingDate: new Date(newMeetingData.date).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     }),
  //     meetingTime: `${newMeetingData.time} - ${
  //       newMeetingData.duration
  //         ? new Date(
  //             new Date(`2000-01-01T${newMeetingData.time}`).getTime() +
  //               Number.parseInt(newMeetingData.duration) * 60000,
  //           ).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  //         : "TBD"
  //     }`,
  //     description: newMeetingData.description,
  //     agenda:
  //       newMeetingData.agenda && newMeetingData.agenda.length > 0
  //         ? newMeetingData.agenda
  //         : ["Meeting agenda to be updated"],
  //     meetingLink: newMeetingData.meetingLink,
  //     meetingId_zoom: newMeetingData.meetingId,
  //     passcode: newMeetingData.passcode,
  //   }

  //   // Add the new meeting to the beginning of the list
  //   setMeetingsData((prev) => [newMeeting, ...prev])

  //   // Show success message
  //   alert(`Meeting "${newMeeting.title}" created successfully!`)
  // }

  // // Expose the addNewMeeting function globally so NewMeeting component can use it
  // useEffect(() => {
  //   ;(window as any).addNewMeeting = addNewMeeting
  //   return () => {
  //     delete (window as any).addNewMeeting
  //   }
  // }, [meetingsData])

  // // Add this useEffect after the existing useEffect that exposes addNewMeeting
  // useEffect(() => {
  //   // Check for new meetings from localStorage when component mounts
  //   const checkForNewMeetings = () => {
  //     const newMeetingsFromStorage = JSON.parse(localStorage.getItem("newMeetings") || "[]")

  //     if (newMeetingsFromStorage.length > 0) {
  //       // Process each new meeting
  //       newMeetingsFromStorage.forEach((newMeetingData: any) => {
  //         addNewMeeting(newMeetingData)
  //       })

  //       // Clear the localStorage after processing
  //       localStorage.removeItem("newMeetings")
  //     }
  //   }

  //   // Check immediately when component mounts
  //   checkForNewMeetings()

  //   // Also check when the page becomes visible (user returns from another tab/page)
  //   const handleVisibilityChange = () => {
  //     if (!document.hidden) {
  //       checkForNewMeetings()
  //     }
  //   }

  //   document.addEventListener("visibilitychange", handleVisibilityChange)

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange)
  //   }
  // }, [])

  const activeMeetingsCount = 1;
  const unreadMeetingsCount = 1;

  // // Meeting detail view
  // if (selectedMeeting) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       {/* Header - Sticky */}
  //       <div className="sticky top-0 z-50 bg-[#1B2560] text-white p-4 md:p-6 shadow-lg">
  //         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
  //           <div className="flex items-center gap-3">
  //             <Button variant="ghost" className="text-white hover:bg-[#1B2560]/80" onClick={handleBackToList}>
  //               ← Back to Meetings
  //             </Button>
  //           </div>
  //           <div className="text-sm">
  //             <div>Meeting Details</div>
  //             <div className="text-xs text-gray-300 mt-1">{currentDateTime}</div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Meeting Details - with ref for scroll control */}
  //       <div ref={detailsContainerRef} className="container mx-auto px-4 md:px-6 py-6 max-w-4xl">
  //         {/* Meeting Header */}
  //         <div className="bg-[#1B2560] text-white p-4 md:p-6 rounded-lg mb-6">
  //           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
  //             <div className="flex flex-wrap items-center gap-2">
  //               <span
  //                 className={`px-3 py-1 text-xs font-bold text-white rounded ${selectedMeeting.priority === "URGENT" ? "bg-red-600 animate-pulse" : "bg-[#1B2560]/95"}`}
  //               >
  //                 {selectedMeeting.priority}
  //               </span>
  //               <span className="bg-[#1B2560]/90 text-white px-3 py-1 text-xs font-bold rounded">
  //                 {selectedMeeting.type}
  //               </span>
  //               <span className="bg-[#1B2560]/80 text-white px-3 py-1 text-xs rounded">
  //                 {selectedMeeting.meetingId}
  //               </span>
  //             </div>
  //             <div className="text-right text-sm">
  //               <div>{selectedMeeting.meetingDate}</div>
  //               <div>{selectedMeeting.meetingTime}</div>
  //             </div>
  //           </div>
  //           <h2 className="text-xl font-bold">{selectedMeeting.title}</h2>
  //         </div>

  //         {/* Meeting Info Grid */}
  //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
  //           <Card>
  //             <div className="p-6">
  //               <div className="space-y-4">
  //                 <div>
  //                   <label className="text-sm font-medium text-gray-500">Meeting Format</label>
  //                   <div className="flex items-center gap-2 mt-1">
  //                     {selectedMeeting.meetingFormat === "in-person" ? (
  //                       <>
  //                         <MapPin className="w-4 h-4 text-[#1B2560]" />
  //                         <span className="text-lg">In-Person Meeting</span>
  //                       </>
  //                     ) : selectedMeeting.meetingFormat === "zoom" ? (
  //                       <>
  //                         <Video className="w-4 h-4 text-blue-600" />
  //                         <span className="text-lg">Zoom Meeting</span>
  //                       </>
  //                     ) : (
  //                       <>
  //                         <Video className="w-4 h-4 text-green-600" />
  //                         <span className="text-lg">Google Meet</span>
  //                       </>
  //                     )}
  //                   </div>
  //                 </div>
  //                 <div>
  //                   <label className="text-sm font-medium text-gray-500">Location</label>
  //                   <p className="text-lg">{selectedMeeting.location}</p>
  //                 </div>
  //                 {selectedMeeting.meetingFormat !== "in-person" && (
  //                   <>
  //                     <div>
  //                       <label className="text-sm font-medium text-gray-500">Meeting Link</label>
  //                       <div className="flex items-center gap-2">
  //                         <p className="text-sm text-blue-600 break-all">{selectedMeeting.meetingLink}</p>
  //                         <Button
  //                           variant="outline"
  //                           size="sm"
  //                           className="ml-2"
  //                           onClick={() => {
  //                             if (selectedMeeting.meetingLink) {
  //                               window.open(selectedMeeting.meetingLink, "_blank")
  //                             }
  //                           }}
  //                         >
  //                           <ExternalLink className="w-4 h-4 mr-1" /> Join
  //                         </Button>
  //                         <Button
  //                           variant="outline"
  //                           size="sm"
  //                           onClick={() => {
  //                             if (selectedMeeting.meetingLink) {
  //                               navigator.clipboard.writeText(selectedMeeting.meetingLink)
  //                               alert("Meeting link copied to clipboard")
  //                             }
  //                           }}
  //                         >
  //                           <Copy className="w-4 h-4 mr-1" /> Copy
  //                         </Button>
  //                       </div>
  //                     </div>
  //                     {selectedMeeting.meetingId_zoom && (
  //                       <div>
  //                         <label className="text-sm font-medium text-gray-500">Meeting ID</label>
  //                         <p className="text-lg font-mono">{selectedMeeting.meetingId_zoom}</p>
  //                       </div>
  //                     )}
  //                     {selectedMeeting.passcode && (
  //                       <div>
  //                         <label className="text-sm font-medium text-gray-500">Passcode</label>
  //                         <p className="text-lg font-mono">{selectedMeeting.passcode}</p>
  //                       </div>
  //                     )}
  //                   </>
  //                 )}
  //               </div>
  //             </div>
  //           </Card>

  //           <Card>
  //             <div className="p-6">
  //               <div className="space-y-4">
  //                 <div>
  //                   <label className="text-sm font-medium text-gray-500">Department</label>
  //                   <p className="text-lg">{selectedMeeting.department}</p>
  //                 </div>
  //                 <div>
  //                   <label className="text-sm font-medium text-gray-500">Organized By</label>
  //                   <p className="text-lg">{selectedMeeting.reportedBy}</p>
  //                 </div>
  //                 <div>
  //                   <label className="text-sm font-medium text-gray-500">Assigned To</label>
  //                   <p className="text-lg text-[#1B2560]">{selectedMeeting.assignedTo}</p>
  //                 </div>
  //                 <div>
  //                   <label className="text-sm font-medium text-gray-500">Status</label>
  //                   <span className="px-2 py-1 text-xs bg-[#1B2560]/10 text-[#1B2560] rounded">
  //                     {selectedMeeting.status}
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>
  //           </Card>
  //         </div>

  //         {/* Description */}
  //         <Card className="mb-6">
  //           <div className="p-6">
  //             <h3 className="text-lg font-semibold mb-3">Meeting Description</h3>
  //             <div className="bg-[#1B2560]/5 p-4 rounded-lg">
  //               <p className="text-gray-700 leading-relaxed">{selectedMeeting.description}</p>
  //             </div>
  //           </div>
  //         </Card>

  //         {/* Agenda */}
  //         <Card>
  //           <div className="p-6">
  //             <h3 className="text-lg font-semibold mb-3">Meeting Agenda</h3>
  //             <ul className="space-y-2">
  //               {selectedMeeting.agenda.map((item: string, index: number) => (
  //                 <li key={index} className="flex items-start gap-2">
  //                   <span className="bg-[#1B2560]/90 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
  //                     {index + 1}
  //                   </span>
  //                   <span className="text-gray-700">{item}</span>
  //                 </li>
  //               ))}
  //             </ul>
  //           </div>
  //         </Card>
  //       </div>
  //     </div>
  //   )
  // }
  console.log(`Active: ${activeMeetings}`);
  console.log(`Finished: ${finishedMeetings}`)

  // Main list view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-50 bg-[#1B2560] text-white p-4 md:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Meeting Notifications</h1>
            {unreadMeetingsCount > 0 && (
              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                {unreadMeetingsCount} new
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <span className="text-sm font-mono">{currentDateTime}</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Mark all as read
              </Button>
              {userHasPermission(/meetings\.(?:create|\*)/) && (
                <Button className="bg-white text-[#1B2560] hover:bg-gray-100" asChild>
                  <Link href="/meetings/new">New Meeting</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
{/* 
      {/* Single Tab - Active Notifications Only 
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex gap-4 md:gap-8 overflow-x-auto">
            <div className="py-4 px-2 border-b-2 border-[#1B2560] text-[#1B2560] font-medium whitespace-nowrap">
              Active Notifications ({activeMeetingsCount})
            </div>
          </div>
        </div>
      </div> */}

      <Tabs defaultValue="active">
        <TabsList className="border-b w-full">
          {[{name: 'Active Meetings', value: 'active', count: activeMeetings.length}, {name: 'Finished Meetings', value: 'finished', count: finishedMeetings.length}].map((tab)=> (
            <TabsTrigger value={tab.value}>
              {tab.name} ({tab.count})
            </TabsTrigger>
          ))}
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
              <>
                TEST
              </>
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

ListMeetings.layout = (e: JSX.Element) => <Authenticated children={e} />
