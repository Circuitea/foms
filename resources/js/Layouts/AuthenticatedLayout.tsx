import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

export default function Authenticated({
    children,
}: PropsWithChildren) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <div className='bg-header text-header-foreground w-full flex justify-center p-8 text-4xl font-black'>
                    <p>CITY DISASTER RISK REDUCTION AND MANAGEMENT OFFICE</p>
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}