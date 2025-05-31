import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import ApplicationLogo from '@/components/ApplicationLogo';
import { Toaster } from '@/components/ui/sonner';

export default function Authenticated({
    children,
}: PropsWithChildren) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <div className='bg-[#1B2560] text-white w-full flex items-center gap-2 p-4 border-b-4 border-red-500'>
                    <ApplicationLogo className='h-20 w-20 rounded-full ml-2' />
                    <p className='font-black tracking-wide w-full' style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '39px', textAlign: 'center'}} >
                        CITY RISK REDUCTION AND MANAGEMENT OFFICE
                    </p>
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