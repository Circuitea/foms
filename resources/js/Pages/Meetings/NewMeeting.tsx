import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function NewMeeting() {
    return (
        <div>
            New Meeting form
        </div>
    );
}

NewMeeting.layout = (e: JSX.Element) => <Authenticated children={e} />