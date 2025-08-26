import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRealTimeClock } from "@/hooks/use-clock";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn, formatName } from "@/lib/utils";
import { PageProps } from "@/types";
import { Task } from "@/types/tasks";
import { Link, router } from "@inertiajs/react";
import dayjs from "dayjs";
import { Clipboard } from "lucide-react";
import { ReactElement } from "react";

export default function ListMyTasks({ tasks }: PageProps<{ tasks: Task[] }>) {
  const tabs = [
    { value: 'active', label: 'Active Tasks', tasks: tasks.filter(task => !task.pivot.finished_at) },
    { value: 'finished', label: 'Finished Tasks', tasks: tasks.filter(task => !!task.pivot.finished_at) },
  ]

  return (
    <div className="px-4 py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <Tabs defaultValue="active">
          <TabsList>
            {tabs.map(({ value, label }, i) => <TabsTrigger key={i} value={value}>{label}</TabsTrigger>)}
          </TabsList>
          {tabs.map(({ value, tasks }, i) => (
            <TabsContent key={i} value={value}>
              <TaskList tasks={tasks} />
            </TabsContent>
          ))}          
        </Tabs>
      </div>
    </div>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
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

  const changeTaskStatus = (id: number, status: 'started' | 'finished' | 'canceled') => {
    router.post(`/my-tasks/${id}/status`, { status }, {
      onFinish: () => router.reload(),
    });
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
            {/* Status Dot */}
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    `w-4 h-4 rounded-full mt-1 flex-shrink-0 bg-gray-400`,
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

            <div className="relative flex-shrink-0 flex gap-2">
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
                  <Button
                    className="flex items-center justify-center rounded bg-[#1B2560]"
                    onClick={() => changeTaskStatus(task.id, 'finished')}
                  >
                    Finish
                  </Button>
                </>
              ) : null}
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

ListMyTasks.layout = (e: ReactElement) => <Authenticated children={e} pageTitle="My Tasks" />