import { Button } from "@/components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { cn, formatName } from "@/lib/utils";
import { PageProps, Personnel } from "@/types";
import { Task } from "@/types/tasks";
import dayjs from "dayjs";
import { Circle, Copy, Dot, User } from "lucide-react";
import { ReactElement } from "react";

type ShowPersonnelProps = PageProps<{
  personnel: Personnel;
}>;

export default function ShowPersonnel({ personnel }: ShowPersonnelProps) {
  return (
    <div className="p-6">
      <div className="p-4 bg-white rounded-lg shadow-lg space-y-4">

        <div className="p-4 bg-gray-100 flex items-center gap-2 shadow-lg rounded-lg">
          <div className="w-40 h-40 bg-white">IMAGE</div>
          <div className="">
            <p className="text-2xl font-bold">{formatName(personnel)}</p>
            <p className="text-gray-400">{personnel.position ?? 'CDRRMO Personnel'}</p>

            <div className="px-2 bg-white rounded-lg inline-flex gap-2 items-center shadow-md">
              <div className={cn(
                "w-2 h-2 rounded-full",
                "bg-green-500"
              )} />
              <span className="text-sm">{personnel.status ?? 'Unavailable'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-2">
          <div className="p-4 bg-gray-100 flex flex-col gap-2 shadow-md rounded-lg">
            <h2 className="text-lg font-bold">Contact and Organization Information</h2>
            <div className="flex flex-col gap-2">
              <div className="p-2 bg-white rounded-lg shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Work Email</span>
                  <Button variant="outline" className="w-10 h-4 text-xs">Copy</Button>
                </div>
                <a
                  href="mailto:charlesaaron.sarmiento@example.com"
                  className="underline text-sm"
                >charlesaaron.sarmiento@example.com</a>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Phone</span>
                  <Button variant="outline" className="w-10 h-4 text-xs">Copy</Button>
                </div>
                <span className="text-sm">(+63) 912-345-6789</span>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-md space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Personnel ID</span>
                  <Button variant="outline" className="w-10 h-4 text-xs">Copy</Button>
                </div>
                <span className="text-sm">6</span>
              </div>

            </div>
          </div>

          <div className="p-4 bg-gray-100 flex gap-2 shadow-md rounded-lg">
            <div className="flex-1 flex flex-col gap-2">
              <h2 className="text-lg font-bold">Ongoing Tasks</h2>
              <div className="flex flex-col gap-2">
                <TaskComponent />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="text-lg font-bold">Finished Tasks</h2>
              <div className="flex flex-col gap-2">
                <TaskComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskComponent({ task }: { task?: Task }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-2 grid grid-cols-[40%_60%] gap-2 px-2">
      <div className="flex flex-col gap-2 border-r border-r-black px-2">
        <span className="text-sm">title</span>
        <span className="text-xs">{dayjs().format('MMM DD, YYYY')}</span>
        <div className="flex justify-between items-center">
          <span className="text-xs">Status</span>
          <span className="text-xs text-gray-400">status</span>
        </div>
      </div>
      <div>
        <span className="text-base/4 line-clamp-4 wrap-break-word">descriptiondescriptiondescription description description description description description description </span>
      </div>
    </div>
  );
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