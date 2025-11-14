import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import ApplicationLogo from '@/components/ApplicationLogo';
import { Toaster } from '@/components/ui/sonner';
import { useEcho, useEchoNotification } from '@laravel/echo-react';
import { Head, Link, usePage } from '@inertiajs/react';
import toast from '@/components/toast';
import { useRealTimeClock } from '@/hooks/use-clock';
import { Bell, LucideIcon, Users } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { StatusProvider } from '@/context/status-context';
import { Task } from '@/types/tasks';
import { NotificationSheet } from '@/components/notification-sheet';
import { Item } from '@radix-ui/react-select';
import { Personnel } from '@/types';
import { formatName } from '@/lib/utils';
import { EquipmentItem } from '@/types/inventory';
import { icon, Marker } from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconBig from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

const MarkerIcon = icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconBig,
  shadowUrl: markerIconShadow,
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize:  [41, 41],
});

Marker.prototype.options.icon = MarkerIcon;

interface BreadcrumbEntry {
  value: string;
  url?: string;
}

export default function Authenticated({
  children,
  pageTitle,
  breadcrumbEntries,
  PageIcon,
}: PropsWithChildren<{
  pageTitle: string,
  breadcrumbEntries?: BreadcrumbEntry[],
  PageIcon?: LucideIcon,
}>) {
  const { user } = usePage().props.auth;
  useEchoNotification<{ task: Task }>(
    `App.Models.Personnel.${user.id}`,
    (notification) => {
      toast('task', 'New Task Assigned', `You have been assigned to Task '${notification.task.title}'`, notification.task.id)
    },
    'broadcast.task-assigned',
  )

  useEchoNotification<{ item: {
    id: number;
    name: string;
    quantity: number;
    level: number;
  }}>(
    `App.Models.Personnel.${user.id}`,
    (notification) => {
      toast('warning', `Item ${notification.item.name} is low.`, `Item quantity is below recommended level. (${notification.item.quantity} < ${notification.item.level})'`)
    },
    'broadcast.consumable-item-low',
  )

  useEchoNotification<{ personnel: Personnel }>(
    `App.Models.Personnel.${user.id}`,
    (notification) => {
      toast('error', `${notification.personnel.first_name} is in an Emergency.`, `${formatName(notification.personnel)} has set their status to Emergency.`)
    },
    'broadcast.personnel-emergency',
  )

  useEchoNotification<{ item: EquipmentItem }>(
    `App.Models.Personnel.${user.id}`,
    (notification) => {
      toast('warning', `Item ${notification.item.name} Maintenance Needed`, `'${notification.item.name}' equipment item is in need of maintenance.`)
    },
    'broadcast.equipment-maintenance',
  )

  const currentTime = useRealTimeClock();

  return (
    <SidebarProvider>
      <StatusProvider>
        <Head title={pageTitle} />
        <AppSidebar />
        <main className='w-full bg-gray-50'>
          <div className='bg-[#1B2560] text-white w-full flex justify-between items-center gap-2 px-4 py-2 border-b-4 border-red-500'>
            <ApplicationLogo className='h-16 w-16 rounded-full ml-2' />
            <p className='font-black tracking-wide w-full text-4xl' style={{ fontFamily: 'Montserrat, sans-serif', textAlign: 'center'}} >
              CITY RISK REDUCTION AND MANAGEMENT OFFICE
            </p>
            <NotificationSheet />
          </div>
          
          <div className="sticky top-0 h-16 bg-[#1B2560] shadow-xs z-50">
            <div className={`mx-auto px-6 ${!!breadcrumbEntries ? 'py-2' : 'py-4'} flex justify-between items-center gap-2`}>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  {PageIcon && <PageIcon className="w-6 h-6 text-white" /> }
                  <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
                </div>

                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbEntries?.map((entry, i) => (
                      <>
                        {i > 0 && <BreadcrumbSeparator className='text-white' />}
                        <BreadcrumbItem>
                          {entry.url ? (
                            <BreadcrumbLink className='text-white' asChild>
                              <Link href={entry.url}>
                                {entry.value}
                              </Link>
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className='text-white'>{entry.value}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="text-sm font-mono text-white">{currentTime}</div>

            </div>
          </div>
          {children}
        </main>
        <Toaster
          position='bottom-right'
          richColors={true}
        />
      </StatusProvider>
    </SidebarProvider>
  );
}