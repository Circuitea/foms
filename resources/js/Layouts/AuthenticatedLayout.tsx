import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import ApplicationLogo from '@/components/ApplicationLogo';
import { Toaster } from '@/components/ui/sonner';
import { useEcho } from '@laravel/echo-react';
import { Head, Link, usePage } from '@inertiajs/react';
import toast from '@/components/toast';
import { useRealTimeClock } from '@/hooks/use-clock';
import { Users } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

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
}: PropsWithChildren<{
  pageTitle: string,
  breadcrumbEntries?: BreadcrumbEntry[],
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
      <Head title={pageTitle} />
      <AppSidebar />
      <main className='w-full'>
        <div className='bg-[#1B2560] text-white w-full flex items-center gap-2 p-4 border-b-4 border-red-500'>
          <ApplicationLogo className='h-20 w-20 rounded-full ml-2' />
          <p className='font-black tracking-wide w-full' style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '39px', textAlign: 'center'}} >
            CITY RISK REDUCTION AND MANAGEMENT OFFICE
          </p>
        </div>
        
        <div className="sticky top-0 bg-[#1B2560]/95 border-b border-gray-300 shadow-sm z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-white" />
                <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
              </div>
              <div className="text-sm font-mono text-white">{currentTime}</div>
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
        </div>
        {children}
      </main>
      <Toaster
        position='top-right'
        richColors={true}
      />
    </SidebarProvider>
  );
}