import { Bell, CheckCheck, Mail, MailOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useEffect, useState } from "react";
import axios from "axios";
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from "./ui/item";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Link } from "@inertiajs/react";
import { Spinner } from "./ui/spinner";
import dayjs from "dayjs";

type Notification = TaskAssignedNotification;

interface TaskAssignedNotification {
  id: string;
  type: 'task-assigned';
  data: {
    task: {
      id: number;
      title: string;
      description: string;
    };
  };

  read_at?: string;
  created_at?: string;
  updated_at?: string;
}

export function NotificationSheet() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('unread');


  useEffect(() => {
    async function getNotifications() {
      const response = await axios.get(`/notifications/${activeTab}`);

      if (response.status === 200) {
        setNotifications(response.data);
        setLoading(false);
      }
    }
    
    if (open) {
      setLoading(true);
      getNotifications();
    }
  }, [open, activeTab]);


  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className='h-10 w-10'><Bell />  </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <TabsList className="justify-center">
              <TabsTrigger className="w-full" value="unread">Unread</TabsTrigger>
              <TabsTrigger className="w-full" value="all">All Notifications</TabsTrigger>
            </TabsList>
          </SheetHeader>
          <div className="py-2 flex flex-col items-stretch justify-start gap-4">
            {loading ? (
              <div className="flex justify-center p-10">
                <Spinner />
              </div>
            ) : notifications.length > 0
              ? notifications.map((notification, index) => (
                  <Item variant="outline" key={index} className={
                    !!notification.read_at ? '' : 'outline-2 outline-solid outline-offset-2 outline-blue-600'
                  }>
                    <NotificationDetails notification={notification} />
                    <ItemFooter className="flex justify-between">
                      <span className="text-xs text-gray-400">{dayjs(notification.created_at).format('MMM DD, YYYY hh:mm A')}</span>
                      {notification.read_at ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              onClick={async () => {
                                const response = await axios.patch<{ notification: Notification }>(`/notifications/${notification.id}/unread`);

                                if (response.status === 200) {
                                  const notifs = [... notifications];
                                  notifs[index] = response.data.notification;
                                  setNotifications(notifs);
                                }
                              }}
                            >
                              <Mail />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Mark As Unread</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              onClick={async () => {
                                const response = await axios.patch<{ notification: Notification }>(`/notifications/${notification.id}/read`);

                                if (response.status === 200) {
                                  const notifs = [... notifications];
                                  notifs[index] = response.data.notification;
                                  setNotifications(notifs);
                                }
                              }}
                            >
                              <MailOpen />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Mark As Read</TooltipContent>
                        </Tooltip>
                      )}
                    </ItemFooter>
                  </Item>
                ))
              : (
                <div className="flex justify-center">
                  <span>No {activeTab === 'unread' ? 'unread ' : ''}notifications.</span>
                </div>
              )
            }
          </div>

        </SheetContent>
      </Sheet>
    </Tabs>
  )
}

function NotificationDetails({ notification }: { notification: Notification }) {
  switch(notification.type) {
    case 'task-assigned':
      return <TaskAssigned notification={notification} />
    default:
      return (
        <>
          <ItemContent>
            <ItemTitle>Notification</ItemTitle>
            <ItemDescription>{JSON.stringify(notification.data)}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button asChild>
              <Link href="/my-tasks">
                My Tasks
              </Link>
            </Button>
          </ItemActions>
        </>
      )
  }
}

function TaskAssigned({ notification }: { notification: TaskAssignedNotification }) {
  return (
    <>
      <ItemContent>
        <ItemTitle>New Task Assignment: '{notification.data.task.title}'</ItemTitle>
        <ItemDescription>You have been assigned to task '{notification.data.task.title}'</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button asChild>
          <Link href="/my-tasks">
            My Tasks
          </Link>
        </Button>
      </ItemActions>
    </>
  )
}