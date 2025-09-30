import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskReport } from "@/Documents/TaskReport"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { cn, formatName } from "@/lib/utils"
import { PageProps } from "@/types"
import { PersonnelWithPivot, Task } from "@/types/tasks"
import { PDFDownloadLink, PDFViewer, usePDF } from "@react-pdf/renderer"
import dayjs from "dayjs"
import { ArrowDown, ArrowUp, Clock, Dot, FileText, Flame, MapPin, Minus, User, Users, Wrench } from "lucide-react"
import { ReactElement } from "react"

export default function ShowTask({ task }: PageProps<{ task: Task }>) {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
        <div className="py-2 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1B2560]">Task Details</h1>
            <span className="text-sm text-gray-500">Task ID: {task.id}</span>
          </div>
          <TaskPriority task={task} />
        </div>

        <div className="py-2">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <span className="text-gray-500">{task.description}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center text-sm gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <div>
              <h3 className="font-bold">Location</h3>
              <span className="text-gray-500">{task.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <div>
              <h3 className="font-bold">Type</h3>
              <span className="text-gray-500">{task.type.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <div>
              <h3 className="font-bold">Date Created</h3>
              <span className="text-gray-500">{dayjs(task.created_at).format('MMMM DD, YYYY hh:mm A')}</span>
            </div>
          </div>
          
        </div>

        
      </div>
      {!!task.transaction && (
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            <h2 className="font-bold text-xl">Allocated Resources</h2>
          </div>
          <div className="grid grid-cols-2">
            {(!!task.transaction.equipment && task.transaction.equipment.length > 0) && (
              <div className="flex flex-col">
                {task.transaction.equipment?.map(equipment => (
                  <div className="flex gap-2 items-center">
                    <Dot className="text-[#1B2560] w-10 h-10" />
                    <span>{equipment.item.name}</span>
                  </div>
                ))}
              </div>
            )}
            {(!!task.transaction.consumables && task.transaction.consumables.length > 0) && (
              <div className="flex flex-col">
                {task.transaction.consumables?.map(consumable => (
                  <div className="flex gap-2 items-center">
                    <Dot className="text-[#1B2560] w-10 h-10" />
                    <span>{consumable.item.name}</span>
                    <span>x</span>
                    <span>{Math.abs(consumable.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="font-bold text-xl">Assigned Personnel</h2>
        </div>
        <div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {task.personnel.map(person => <PersonnelEntry person={person} />)}
        </div>
      </div>
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={!task.finished_at}
              className="bg-[#1B2560]"
            >
              Generate Report
            </Button>

          </DialogTrigger>
          <DialogContent className="h-full grid-rows-12">
            <DialogHeader>
              <DialogTitle>Report Preview</DialogTitle>
              <DialogDescription>Preview of the generated task report</DialogDescription>
            </DialogHeader>
            <div className="row-span-11 h-full relative top-0">
              <PDFViewer className="w-full h-full">
                <TaskReport task={task} />
              </PDFViewer>
            </div>
            <DialogFooter>
              <Button asChild>
                <PDFDownloadLink
                  document={<TaskReport task={task} />}
                  fileName={`Task${task.id}_Report.pdf`}
                >
                  Download Report
                </PDFDownloadLink>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function PersonnelEntry({ person }: { person: PersonnelWithPivot }) {
  function getStatusColor(person: PersonnelWithPivot) {
    if (!!person.pivot.finished_at) {
      return 'bg-green-200 text-green-600';
    } else if (!!person.pivot.started_at) {
      return 'bg-blue-200 text-blue-600';
    } else {
      return 'bg-gray-200 text-gray-600';
    }
  }

  return (
    <div className="flex gap-2 items-center outline-2 outline-gray-200 rounded-lg shadow-lg">
      <div className="px-2 py-6 flex justify-between items-center gap-4 w-full">
        <div className="rounded-full bg-gray-200 p-4 flex items-center justify-center">
          <User />
        </div>
        <div className="flex flex-col justify-center items-start flex-1">
          <p className="text-xl font-bold">{formatName(person)}</p>
          <span>{person.position ?? 'CDRRMO Personnel'}</span>
        </div>
        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger className={cn(
              "font-bold rounded-lg px-2 h-10",
              getStatusColor(person),
            )}>
              {!!person.pivot.finished_at ? 'Finished' : !!person.pivot.started_at ? 'Started' : 'Assigned'}
            </TooltipTrigger>
            <TooltipContent className={cn(
              "font-bold",
              getStatusColor(person),
            )}>
              {!!person.pivot.finished_at
                ? `Finished at ${dayjs(person.pivot.finished_at).format('MMMM DD, YYYY hh:mm A')}`
                : !!person.pivot.started_at 
                  ? `Started at ${dayjs(person.pivot.started_at).format('MMMM DD, YYYY hh:mm A')}`
                  : `Not Started`
              }
            </TooltipContent>
          </Tooltip>
          {!!person.pivot.finished_at && !!person.pivot.additional_notes && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center justify-center rounded-lg bg-[#1B2560]">
                  View Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>View Note</DialogTitle>
                  <DialogDescription>Additional note provided by {formatName(person)}.</DialogDescription>
                </DialogHeader>
                <div className="h-full relative top-0">
                  <div className="py-4 space-y-2">
                    <Label htmlFor="notes">Additional Note</Label>
                    <Textarea
                      id="notes"
                      value={person.pivot.additional_notes}
                      rows={10}
                      readOnly
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}

function TaskPriority({ task }: { task: Task }) {
  switch(task.priority.name) {
    default:
    case 'Low':
      return (
        <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg flex gap-2 items-center">
          <ArrowDown className="w-5 h-5" />
          <span className="font-bold text-sm">Low Priority</span>
        </div>
      )
    case 'Normal':
      return (
        <div className="px-2 py-1 bg-blue-200 text-blue-700 rounded-lg flex gap-2 items-center">
          <Minus className="w-5 h-5" />
          <span className="font-bold text-sm">Normal Priority</span>
        </div>
      )
    case 'High':
      return (
        <div className="px-2 py-1 bg-orange-200 text-orange-700 rounded-lg flex gap-2 items-center">
          <ArrowUp className="w-5 h-5" />
          <span className="font-bold text-sm">High Priority</span>
        </div>
      )
    case 'Urgent':
      return (
        <div className="px-2 py-1 bg-red-200 text-red-700 rounded-lg flex gap-2 items-center">
          <Flame className="w-5 h-5" />
          <span className="font-bold text-sm">Urgent Priority</span>
        </div>
      )
  }
}

ShowTask.layout = (e: ReactElement) => (
  <Authenticated
    children={e}
    pageTitle="Task Management"
    breadcrumbEntries={[
      {value: 'Task Management', url: '/tasks'},
      {value: `Task (ID:${e.props.task.id})`}
    ]}
  />
)