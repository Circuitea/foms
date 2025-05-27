import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function ListNotifications() {
    return (
        <div>
            List Notifications
        </div>
    );
}

ListNotifications.layout = (e: JSX.Element) => <Authenticated children={e} />