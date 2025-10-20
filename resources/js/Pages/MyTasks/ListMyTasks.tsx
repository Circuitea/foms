import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStatusDispatch } from "@/context/status-context";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn, formatName } from "@/lib/utils";
import { PageProps } from "@/types";
import { Task, TaskWithAttachments } from "@/types/tasks";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
import { Bell, Clipboard } from "lucide-react";
import { ReactElement } from "react";
import { FinishTaskDialog } from "./FinishTaskDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageTabs, PageTabsContent, PageTabsList, PageTabsTrigger } from "@/components/tabs";

export default function ListMyTasks({ tasks }: PageProps<{ tasks: TaskWithAttachments[] }>) {

  const tabs = [
    { value: 'active', label: 'Active Tasks', tasks: tasks.filter(task => !task.pivot.finished_at) },
    { value: 'finished', label: 'Finished Tasks', tasks: tasks.filter(task => !!task.pivot.finished_at) },
  ];

  return (
    <div>
      <PageTabs defaultValue="active">
        <div className="sticky top-16 border-b border-gray-200 bg-[#1B2560]">
          <PageTabsList>
            {tabs.map(({ value, label }, i) => <PageTabsTrigger key={i} value={value}>{label}</PageTabsTrigger>)}
          </PageTabsList>
        </div>

        <div className="mx-auto sm:px-6 lg:px-8">
            
            {tabs.map(({ value, tasks }, i) => (
              <PageTabsContent key={i} value={value}>
                <TaskList tasks={tasks} />
              </PageTabsContent>
            ))}          
        </div>
      </PageTabs>
    </div>
  );
}

function TaskList({ tasks }: { tasks: TaskWithAttachments[] }) {
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-700 text-white animate-pulse"
      case "high":
        return "bg-red-600 text-white"
      case "normal":
        return "text-white"
      case "low":
      default:
        return "bg-gray-600 text-white"
    }
  }

  const changeTaskStatus = (id: number, status: 'started' | 'finished' | 'canceled') => {
    if (status !== 'finished') router.post(`/my-tasks/${id}/status`, { status });
  }

  return (
    <div className="bg-white shadow-lg sm:rounded-lg border border-gray-200">
      <div className="bg-gray-50 divide-y divide-gray-200">
        {tasks.map((task, i) => (
          <div
            key={i}
            className="p-6 hover:bg-white"
          >

          <div className="flex items-start gap-4">
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    `w-4 h-4 rounded-full mt-1 shrink-0 bg-gray-400`,
                    task.priority.name === "urgent" ? "animate-pulse" : null,
                    !task.pivot.started_at ? 'bg-yellow-400' : !task.pivot.finished_at ? 'bg-blue-500' : 'bg-green-500'
                  )}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-50 text-black border border-gray-200">
                <span>{!task.pivot.started_at ? 'Assigned' : !task.pivot.finished_at ? 'Started' : 'Finished'}</span>
              </TooltipContent>
            </Tooltip>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Priority Badge and Title */}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded font-medium bg-[#1B2560]",
                    getPriorityBadgeStyle(task.priority.name.toLowerCase()),
                  )}
                >
                  {task.priority.name.toUpperCase()}
                </span>
                <div className="flex items-center gap-2">
                  <Clipboard className="w-4 h-4" />
                  
                  <span className="text-xs text-gray-600 font-medium">{task.type.name}</span>
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-mono">
                  ID: {task.id}
                </span>
              </div>

              <h3
                className={`text-base font-medium mb-3 `}
              >
                {task.title}
              </h3>

              {/* Details Row */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Location:</span> {task.location}
                </div>
                <div>
                  <span className="font-medium">Reported by:</span> {formatName(task.creator)}
                </div>
              </div>

              {/* Bottom Row - Time and Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{dayjs(task.created_at).format("MMM DD, YYYY hh:mm A")}</span>
                <span className="text-xs text-gray-400">({dayjs(task.created_at).fromNow()})</span>
              </div>
            </div>

            <div className="relative shrink-0 flex gap-2">
              {!task.pivot.started_at ? (
                <Button
                  className="flex items-center justify-center rounded bg-[#1B2560]"
                  onClick={() => changeTaskStatus(task.id, 'started')}
                >
                  Start
                </Button>
              ) : !task.pivot.finished_at ? (
                <>
                  <Button
                    variant="destructive"
                    className="flex items-center justify-center rounded "
                    onClick={() => changeTaskStatus(task.id, 'canceled')}
                  >
                    Cancel
                  </Button>
                  <FinishTaskDialog task={task} onSubmit={() => changeTaskStatus(task.id, 'finished')} />
                </>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center justify-center rounded bg-[#1B2560]">
                      View Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-7xl h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>View Attached Note</DialogTitle>
                      <DialogDescription>Additional note that will be attached to the final task report.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden flex-1">
                      <div className="space-y-2 flex flex-col">
                        <Label htmlFor="notes">Additional Note</Label>
                        {!!task.pivot.additional_notes ? (
                          <Textarea
                            id="notes"
                            value={task.pivot.additional_notes}
                            readOnly
                            className="flex-1 m-1"
                          />
                        ) : (
                          <Textarea
                            id="notes"
                            value="No additional notes provided."
                            readOnly
                            className="flex-1 m-1 italic"
                          />
                        )}
                        {/* <Textarea
                          id="notes"
                          value={task.pivot.additional_notes}
                          readOnly
                          className="flex-1 m-1"
                        /> */}
                      </div>
                      {task.attachments.length >= 1 && (
                        <div className="space-y-2 flex flex-col overflow-hidden">
                          <Label>Attachments</Label>
                          <div className="flex-1 overflow-y-auto rounded-md border p-2">
                            {task.attachments.map((attachment, index) => (
                              <Tooltip key={index} >
                                <TooltipTrigger asChild>
                                  <img className="w-full object-contain mx-auto my-2" src={`/storage/${attachment.file_path}`} />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <span>{attachment.file_name}</span>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
        ))}
        {tasks.length === 0 && (
          <div className="px-6 py-4 flex justify-center">
            <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          </div>
        )}
      </div>
    </div>
  );
}

ListMyTasks.layout = (e: ReactElement) => <Authenticated PageIcon={Bell} children={e} pageTitle="My Tasks" />