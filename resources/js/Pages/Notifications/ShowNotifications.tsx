import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function ShowNotifications() {
    return (
        <div>
            Show Notification Message
        </div>
    );
}

ShowNotifications.layout = (e: JSX.Element) => <Authenticated children={e} />