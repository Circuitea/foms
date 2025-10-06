import { cn } from "@/lib/utils";
import { ActivityDetail, ActivityType } from "@/types/activities"
import dayjs from "dayjs";
import { CircleAlert, CircleCheck, CirclePlay, CircleStop, LogIn, LogOut, LucideIcon, Pen } from "lucide-react";

const getTypeTheme = (type: ActivityType): [string, LucideIcon, string] => {
  switch(type) {
    case 'login_activity':
      return ['bg-blue-100', LogIn, 'text-blue-600'];
    case 'logout_activity':
      return ['bg-orange-50', LogOut, 'text-orange-600'];
    case 'start_task_activity':
      return ['bg-yellow-50', CirclePlay, 'text-yellow-600'];
    case 'cancel_task_activity':
      return ['bg-red-50', CircleStop, 'text-red-600'];
    case 'finish_task_activity':
      return ['bg-green-50', CircleCheck, 'text-green-600'];
    case 'change_status_activity':
      return ['bg-purple-50', Pen, 'text-purple-600'];
    default:
      return ['bg-gray-50', CircleAlert, 'text-gray-600'];
  }
}

const getTitle = (activity: ActivityDetail): string => {
  switch(activity.activity_type) {
    case 'login_activity':
      return 'Logged in to Mobile Application';
    case 'logout_activity':
      return 'Logged out of Mobile Application';
    case 'start_task_activity':
      return `Started Task "${activity.activity.task?.title}"`;
    case 'cancel_task_activity':
      return `Canceled Task "${activity.activity.task?.title}"`;
    case 'finish_task_activity':
      return `Finished Task "${activity.activity.task?.title}"`;
    case 'change_status_activity':
      return `Changed status from "${activity.activity.old_status}" to "${activity.activity.new_status}"`;
    default:
      return 'Did activity';
  }
}

export function Activity({ activity }: { activity: ActivityDetail }) {
  const [bgColor, Icon, iconColor] = getTypeTheme(activity.activity_type);

  return (
    <div className="bg-white rounded-lg shadow-xs border border-gray-200">
      <div className={cn(
        "px-6 py-4 border-b border-gray-200",
        bgColor,
      )}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon className={cn(
              "w-5 h-5",
              iconColor
            )} />
            <h3 className="text-lg font-semibold text-gray-900">{getTitle(activity)}</h3>
          </div>
          <p className="text-sm text-gray-700">{dayjs(activity.created_at).format("hh:mm A")}</p>
        </div>
      </div>
      <div className="px-6 py-4 grid grid-cols-3">
        {activity.activity_type === 'login_activity'
          || activity.activity_type === 'logout_activity'
          ? (
            <div>
              <p className="block text-sm font-medium text-gray-400">Device Name</p>
              <p className="text-md text-gray-900">{activity.activity.device_name}</p>
            </div>
          ) : activity.activity_type === 'start_task_activity'
          ? (
            <>
              <div>
                <p className="block text-sm font-medium text-gray-400">Task Name</p>
                <p className="text-md text-gray-900">{activity.activity.task?.title}</p>
              </div>
              <div>
                <p className="block text-sm font-medium text-gray-400">Task Due Date</p>
                <p className="text-md text-gray-900">{dayjs(activity.activity.task?.due_date).format("MMM DD, YYYY hh:mm A")}</p>
              </div>
            </>
          ) : null}
      </div>
    </div>
  );
}