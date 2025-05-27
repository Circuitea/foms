import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import TrackingMap from './Mapping/TrackingMap';

export default function Dashboard() {
    // const [ boundary, setBoundary ] = useState({});

    // useEffect(() => {
    //     fetch('/sanjuan-boundary.geojson').then((res) => res.json()).then((data) => setBoundary(data));
    // }, [boundary]);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="p-6 text-gray-900 dark:text-gray-100 text-xl">
                Dashboard
                <TrackingMap />
            </div>
        </AuthenticatedLayout>
    );
}
