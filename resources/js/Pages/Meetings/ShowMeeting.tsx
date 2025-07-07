import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRealTimeClock } from "@/hooks/use-clock"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { PageProps } from "@/types"
import { Meeting } from "@/types/meetings"
import { Link, usePage } from "@inertiajs/react"
import dayjs from "dayjs"
import { ArrowLeft, Copy, ExternalLink, MapPin, Video } from "lucide-react"

export default function ShowMeeting({ meeting }: PageProps<{ meeting: Meeting }>) {
    const currentDateTime = useRealTimeClock()

    const meetingDate = dayjs(meeting.schedule);
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-50 bg-[#1B2560] text-white p-4 md:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-white hover:bg-[#1B2560]/80" asChild>
                <Link href='/meetings'>
                    <ArrowLeft />
                    Back to Meetings
                </Link>
              </Button>
            </div>
            <div className="text-sm">
              <div>Meeting Details</div>
              <div className="text-xs text-gray-300 mt-1">{currentDateTime}</div>
            </div>
          </div>
        </div>

        {/* Meeting Details - with ref for scroll control */}
        <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl">
          {/* Meeting Header */}
          <div className="bg-[#1B2560] text-white p-4 md:p-6 rounded-lg mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded ${meeting.priority === "urgent" ? "bg-red-600 animate-pulse text-white" : "bg-white/95 text-black"}`}
                >
                  {meeting.priority.toUpperCase()}
                </span>
                <span className="bg-[#1B2560]/90 text-white px-3 py-1 text-xs font-bold rounded">
                  {meeting.type.name}
                </span>
              </div>
              <div className="text-right text-sm">
                <div>{meetingDate.format('MMMM DD, YYYY')}</div>
                <div>{meetingDate.format('hh:mm A')} ({meetingDate.fromNow()})</div>
              </div>
            </div>
            <h2 className="text-xl font-bold">{meeting.title}</h2>
          </div>

          {/* Meeting Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Meeting Format</label>
                    <div className="flex items-center gap-2 mt-1">
                      {meeting.format_type === "in_person_meeting" ? (
                        <>
                          <MapPin className="w-4 h-4 text-[#1B2560]" />
                          <span className="text-lg">{meeting.format.meeting_location}</span>
                        </>
                      ) : meeting.format_type === "zoom_meeting" ? (
                        <>
                          <Video className="w-4 h-4 text-blue-600" />
                          <span className="text-lg">Zoom Meeting</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 text-green-600" />
                          <span className="text-lg">Google Meet</span>
                        </>
                      )}
                    </div>
                  </div>
                  {meeting.format_type !== "in_person_meeting" && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Meeting Link</label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-blue-600 break-all">{meeting.format.meeting_link}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2"
                            onClick={() => {
                              if (meeting.format.meeting_link) {
                                window.open(meeting.format.meeting_link, "_blank")
                              }
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" /> Join
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (meeting.format.meeting_link) {
                                navigator.clipboard.writeText(meeting.format.meeting_link)
                                alert("Meeting link copied to clipboard")
                              }
                            }}
                          >
                            <Copy className="w-4 h-4 mr-1" /> Copy
                          </Button>
                        </div>
                      </div>
                      {meeting.format_type === 'zoom_meeting' && (
                        <div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Meeting ID</label>
                            <p className="text-lg font-mono">{meeting.format.meeting_id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Passcode</label>
                            <p className="text-lg font-mono">{meeting.format.meeting_passcode}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Department</label>
                    <p className="text-lg">{meeting.section.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Organized By</label>
                    <p className="text-lg">{meeting.organizer.first_name} {meeting.organizer.middle_name && meeting.organizer.middle_name.charAt(1) + "."} {meeting.organizer.surname}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`mx-2 px-2 py-1 text-xs rounded ${meeting.status === "Active" ? "bg-[#1B2560] text-white"
                      : meeting.status === 'Ongoing' ? "bg-green-400 text-white" : "bg-gray-200 text-gray-700"}`
                    }>
                      {meeting.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Description */}
          <Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">Meeting Description</h3>
              <div className="bg-[#1B2560]/5 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{meeting.description}</p>
              </div>
            </div>
          </Card>

          {/* Agenda */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">Meeting Agenda</h3>
              <ul className="space-y-2">
                {/* {meeting.agendas.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-[#1B2560]/90 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))} */}

                {meeting.agendas.sort((a, b) => a.order - b.order).map((agenda) => (
                  <li key={agenda.order} className="flex items-start gap-2">
                    <span className="bg-[#1B2560]/90 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {agenda.order + 1}
                    </span>
                    <span className="text-gray-700">{agenda.agenda}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    )
}

ShowMeeting.layout = (e: JSX.Element) => <Authenticated children={e} />