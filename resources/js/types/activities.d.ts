import { Task } from "./tasks";

export type ActivityType = 'login_activity' | 'logout_activity' | 'start_task_activity' | 'finish_task_activity' | 'change_status_activity';

export interface ActivityDetail {
  activity_type: ActivityType;
  activity: {
    device_name?: string,
    task?: Task,
    old_status?: Status,
    new_status?: Status,
  };
  created_at: string;
}
