import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import ApplicationLogo from '@/components/ApplicationLogo';
import { Toaster } from '@/components/ui/sonner';
import { useEcho } from '@laravel/echo-react';
import { Head, Link, usePage } from '@inertiajs/react';
import toast from '@/components/toast';
import { useRealTimeClock } from '@/hooks/use-clock';
import { LucideIcon, Users } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { StatusProvider } from '@/context/status-context';

interface Notification {
  title: string;
  message: string;
}

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
  useEcho<Notification>(
    `notifications.${user.id}`,
    `NotificationSent`,
    (e) => {
      toast('success', e.title, e.message);
    }
  )

  const currentTime = useRealTimeClock();

  return (
    <SidebarProvider>
      <StatusProvider>
        <Head title={pageTitle} />
        <AppSidebar />
        <main className='w-full bg-gray-50'>
          <div className='bg-[#1B2560] text-white w-full flex items-center gap-2 p-4 border-b-4 border-red-500'>
            <ApplicationLogo className='h-20 w-20 rounded-full ml-2' />
            <p className='font-black tracking-wide w-full' style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '39px', textAlign: 'center'}} >
              CITY RISK REDUCTION AND MANAGEMENT OFFICE
            </p>
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
          position='top-right'
          richColors={true}
        />
      </StatusProvider>
    </SidebarProvider>
  );
}