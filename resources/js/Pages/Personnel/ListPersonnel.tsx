import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { PageProps, Personnel } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

const data: Personnel[] = [
    {
        id: 1,
        first_name: 'Test',
        surname: 'Example',
        email: 'test@example.com',
        roles: [{
            id: 3,
            name: 'IT Staff',
        }],
    },
];

const columns: ColumnDef<Personnel>[] = [
    {
        accessorKey: 'first_name',
        header: 'First Name',
    },
    {
        accessorKey: 'middle_name',
        header: 'Middle Name',
    },
    {
        accessorKey: 'surname',
        header: 'Surname',
    },
    {
        accessorKey: 'email',
        header: 'Email Address',
    },
    {
        accessorKey: 'mobile_number',
        header: 'Mobile No.',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost'>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];

interface PaginatedPersonnel {
    data: Personnel[],

    link: {
        active: boolean,
        label: string,
        url?: string,
    }[],
}

export default function ListPersonnel({ personnel }: PageProps<{ personnel: PaginatedPersonnel }>) {
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <Authenticated>
            <Head title="Personnel - List" />
            <div className="px-2">
                <div className="w-full flex justify-between">
                    <div className="p-6 text-xl">
                        Personnel
                    </div>
                    <div className="p-6 text-xl">
                        {currentTime}
                    </div>
                </div>
                <div className="flex justify-end mb-2">
                    <Button asChild>
                        <Link href="/personnel/new">New Personnel</Link>
                    </Button>
                </div>
                <div>
                    <DataTable columns={columns} data={personnel.data} />
                </div>
            </div>
        </Authenticated>
    )
}


function getCurrentTime() {
    const date = new Date();
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).format(date).slice(0, 8);
}