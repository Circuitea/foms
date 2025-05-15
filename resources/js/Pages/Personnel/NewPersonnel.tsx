import InputError from "@/components/InputError";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react"
import { FormEventHandler } from "react";

export default function NewPersonnel() {
    const { data, setData, processing, errors, post, reset } = useForm({
        first_name: '',
        middle_name: '',
        surname: '',
        name_extension: '',
        email: '',
        mobile_number: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post('/personnel/new', {
            onFinish: () => { reset('password'); }
        });
    }
    
    return (
        <Authenticated>
            <Head title="New Personnel" />
            <div className="p-2 space-y-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>New Personnel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-5">
                                <div className="w-full flex space-x-2">
                                    <div className="w-full">
                                        <Label htmlFor="surname">Surname</Label>
                                        <Input
                                            id='surname'
                                            name='surname'
                                            value={data.surname}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('surname', e.target.value)}
                                            placeholder="e.g. Dela Cruz"
                                        />
                                        <InputError message={errors.surname} className="mt-2" />
                                    </div>
                                    <div className="w-full">
                                        <Label htmlFor="first_name">First Name</Label>
                                        <Input
                                            id='first_name'
                                            name='first_name'
                                            value={data.first_name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            placeholder="e.g. Juan"
                                        />
                                        <InputError message={errors.first_name} className="mt-2" />
                                    </div>
                                    <div className="w-full">
                                        <Label htmlFor="middle_name">Middle Name</Label>
                                        <Input
                                            id='middle_name'
                                            name='middle_name'
                                            value={data.middle_name}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('middle_name', e.target.value)}
                                            placeholder="e.g. Reyes"
                                        />
                                        <InputError message={errors.middle_name} className="mt-2" />
                                    </div>
                                    <div className="w-full">
                                        <Label htmlFor="name_extension">Extension</Label>
                                        <Input
                                            id='name_extension'
                                            name='name_extension'
                                            value={data.name_extension}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('name_extension', e.target.value)}
                                            placeholder="e.g. JR, SR, III"
                                        />
                                        <InputError message={errors.name_extension} className="mt-2" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id='email'
                                        type="email"
                                        name='email'
                                        value={data.email}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="e.g. mail@example.com"
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="mobile_number">Mobile Number</Label>
                                    <Input
                                        id='mobile_number'
                                        name='mobile_number'
                                        value={data.mobile_number}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('mobile_number', e.target.value)}
                                        placeholder="e.g. 09123456789"
                                    />
                                    <InputError message={errors.mobile_number} className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id='password'
                                        name='password'
                                        type="password"
                                        value={data.password}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.first_name} className="mt-2" />
                                </div>
                                <Button className="mt-2" disabled={processing}>Create</Button>
                            </form>
                        </CardContent>
                    </Card>
            </div>
        </Authenticated>
    )
}