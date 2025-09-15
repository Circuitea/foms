import toast from "@/components/toast";
import { Button } from "@/components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn, formatName, toProperCase } from "@/lib/utils";
import { PageProps, Personnel, Status } from "@/types";
import { Task } from "@/types/tasks";
import dayjs from "dayjs";
import { Circle, Copy, Dot, User } from "lucide-react";
import { ReactElement } from "react";

type ShowPersonnelProps = PageProps<{
  personnel: Personnel;
  tasks: {
    ongoing: Task[];
    finished: Task[];
  }
}>;

export default function ShowPersonnel({ personnel, tasks }: ShowPersonnelProps) {
  const personnnelInfo = [
    { label: 'Work Email', value: personnel.email },
    { label: 'Phone', value: personnel.mobile_number },
    { label: 'ID', value: `PID-${personnel.id}` },
  ];

  function getStatusColor(status: Status | undefined) {
    // 'available': "bg-green-100 text-green-800",
    //   'assigned': "bg-blue-100 text-blue-800",
    //   'on leave': "bg-yellow-100 text-yellow-800"
    switch(status) {
      case 'available':
        return 'bg-green-500';
      case 'assigned':
        return 'bg-blue-500';
      case 'on leave':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  return (
    <div className="p-6">
      <div className="p-4 bg-white rounded-lg shadow-lg space-y-4">

        <div className="p-4 bg-gray-100 flex items-center gap-2 shadow-lg rounded-lg">
          <div className="w-40 h-40 bg-white flex justify-center items-center">
            {!!personnel.profile_picture_filename ? 'has profile picture' : (
              <User className="w-32 h-32 text-gray-500" />
            )}
          </div>
          <div className="">
            <p className="text-2xl font-bold">{formatName(personnel)}</p>
            <p className="text-gray-400">{personnel.position ?? 'CDRRMO Personnel'}</p>

            <div className="px-2 bg-white rounded-lg inline-flex gap-2 items-center shadow-md">
              <div className={cn(
                "w-2 h-2 rounded-full",
                getStatusColor(personnel.status),
              )} />
              <span className="text-sm">{toProperCase(personnel.status ?? 'Unavailable')}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 p-4 bg-gray-100 flex flex-col gap-2 shadow-md rounded-lg">
            <h2 className="text-lg font-bold">Contact and Organization Information</h2>
            <div className="flex flex-col gap-2">
              {personnnelInfo.map(info => <InfoComponent label={info.label} value={info.value} />)}
            </div>
          </div>

          <div className="flex-[3] p-4 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex flex-col gap-2 bg-gray-100 shadow-md rounded-lg p-2">
              <h2 className="text-lg font-bold">Ongoing Tasks</h2>
              <div className="flex flex-col gap-2">
                {tasks.ongoing.length > 0
                  ? tasks.ongoing.map(task => <TaskComponent task={task} />)
                  : (
                    <span className="text-gray-500 text-center p-8">No Ongoing Tasks</span>
                  )}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 bg-gray-100 shadow-md rounded-lg p-2">
              <h2 className="text-lg font-bold">Finished Tasks</h2>
              <div className="flex flex-col gap-2">
                {tasks.finished.length > 0
                  ? tasks.finished.map(task => <TaskComponent task={task} />)
                  : (
                    <span className="text-gray-500 text-center p-8">No Finished Tasks</span>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskComponent({ task }: { task: Task }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-2 grid grid-cols-[40%_60%] gap-2 px-2">
      <div className="flex flex-col gap-2 border-r border-r-black px-2">
        <span className="text-sm">{task.title}</span>
        <span className="text-xs">{dayjs(task.created_at).format('MMM DD, YYYY')}</span>
        <div className="flex justify-between items-center">
          <span className="text-xs">Status</span>
          <span className="text-xs text-gray-400">{task.pivot.finished_at ? 'Finished' : task.pivot.started_at ? 'Ongoing' : 'Assigned'}</span>
        </div>
      </div>
      <div>
        <span className="text-base/4 line-clamp-4 wrap-break-word">{task.description}</span>
      </div>
    </div>
  );
}

function InfoComponent({ label, value }: { label: string, value?: string }) {
  return value && (
    <div className="p-2 bg-white rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm">{label}</span>
        <Button
          variant="outline"
          className="w-10 h-4 text-xs"
          onClick={() => {
            navigator.clipboard.writeText(value).then(() => {
              toast('success', 'Copied to Clipboard', `${value} copied to clipboard.`);
            })
          }}
        >Copy</Button>
      </div>
      <span className="text-sm">{value}</span>
    </div>
  )
}

ShowPersonnel.layout = (e: ReactElement) => (
  <Authenticated
    pageTitle={formatName(e.props.personnel)}
    PageIcon={User}
    children={e}
    breadcrumbEntries={[
      {
        value: 'Personnel Management',
        url: '/personnel',
      },
      {
        value: `Personnel (ID:${e.props.personnel.id})`,
      },
    ]}
  />
);