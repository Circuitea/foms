import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="p-6 text-gray-900 dark:text-gray-100 text-xl">
                Dashboard
            </div>
        </AuthenticatedLayout>
    );
}
