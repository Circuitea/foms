import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function ListMeetings() {
    return (
        <div>
            List Meetings
        </div>
    );
}

ListMeetings.layout = (e: JSX.Element) => <Authenticated children={e} />

