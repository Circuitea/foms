import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <div>
            <Head title="Dashboard" />
            <div className="text-gray-900 dark:text-gray-100 text-xl">
                Dashboard
            </div>
        </div>
    );
}

Dashboard.layout = (e: JSX.Element) => <AuthenticatedLayout children={e} />
