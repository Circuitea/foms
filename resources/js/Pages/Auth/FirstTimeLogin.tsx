import Guest from "@/Layouts/GuestLayout";

export default function FirstTimeLogin() {
    return (
        <div>
            password form here

            REQUEST TO 'POST /first-time'
        </div>
    );
}

FirstTimeLogin.layout = (e: JSX.Element) => <Guest children={e} />