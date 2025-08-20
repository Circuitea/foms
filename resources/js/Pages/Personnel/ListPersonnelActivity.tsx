import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { formatName } from "@/lib/utils";
import { PageProps, Personnel, Status } from "@/types";
import { ActivityDetail } from "@/types/activities";
import { Task } from "@/types/tasks";
import { BookCheck, Briefcase, CircleCheck, CirclePlay, LogIn, LogOut, Pen, Send } from "lucide-react";
import { ReactElement } from "react";
import { Activity } from "./ActivityPartials/Activity";
import dayjs from "dayjs";


type ListPersonnelActivityProps = PageProps<{
  personnel: Personnel & {
    activities: ActivityDetail[],
  },
}>;

export default function ListPersonnelActivity({ personnel }: ListPersonnelActivityProps) {

  const activities = personnel.activities.reduce<{
    [key: string]: ActivityDetail[],
  }>((acc, item) => {
    const dateKey = dayjs(item.created_at).format("YYYY-MM-DD");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);

    return acc;
  }, {});

  return (
    <div className="px-6 py-4">
      <div className="px-6 py-4 border rounded-lg border-gray-200">
        <h3 className="text-lg font-medium text-gray-900"><b>{formatName(personnel)}</b>'s Activity</h3>
      </div>

      <div className="px-2 md:px-20 py-4">
        {Object.entries(activities).map(([date, details]) => (
          <div className="flex flex-col gap-2">
            <div className="w-full flex items-center">
              <hr className="w-full text-gray-900 outline-1 outline-gray-900" />
              <span className="w-1/2 text-gray-700 text-center">{dayjs(date, "YYYY-MM-DD").format("MMMM DD, YYYY")}</span>
              <hr className="w-full text-gray-900 outline-1 outline-gray-900" />
            </div>

            {details.map(activity => (
              <Activity activity={activity} />
            ))}
          </div>

        ))}

      </div>
    </div>
  );
}

ListPersonnelActivity.layout = (e: ReactElement<ListPersonnelActivityProps>) => {
  const { id } = e.props.personnel;

  return (
    <Authenticated
      children={e}
      pageTitle="Personnel Activity"
      breadcrumbEntries={[
        {
          value: 'Personnel Management',
          url: '/personnel',
        },
        {
          value: `Personnel (ID:${id})`,
          url: `/personnel/${id}`,
        },
        {
          value: 'Activity',
        },
    ]} />
  )
}