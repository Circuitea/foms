import ApplicationLogo from '@/components/ApplicationLogo';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className={`bg-[url("/img/guest_bg.jpg")]` + ' bg-cover bg-center'}>
            <div className='flex flex-col min-h-screen pt-4 items-center sm:justify-center sm:pt-0 bg-white/50'>
                <div className='flex items-stretch  '>
                    <div className='mt-6 flex flex-col justify-center items-center bg-white sm:rounded-tl-lg sm:rounded-bl-lg min-h-full px-10'>
                        <ApplicationLogo className="h-28 w-28 mb-2" />
                        <p className='text-center font-bold'>City Disaster Risk Reduction and Management Office</p>
                    </div>

                    <div className="mt-6 w-full overflow-hidden bg-auth text-auth-foreground px-6 py-24 sm:max-w-md sm:rounded-tr-lg sm:rounded-br-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
