"use client"

import React, { memo, useState } from "react"
import {
  Search,
  Filter,
  Plus,
  Users,
  UserCheck,
  Clock,
  MapPin,
  X,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Import,
} from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/components/ui/button"
import { Link, usePage } from "@inertiajs/react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { PageProps, Personnel, Section, Status } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Select from 'react-select';
import { toProperCase, userHasPermission } from "@/lib/utils"
import Paginator from "@/types/paginator"
import { useRealTimeClock } from "@/hooks/use-clock"

type RoleLabels = { [key: string]: string };

const getStatusColor = (status: Status | null) => {
    if (!status) {
      return 'bg-gray-100 text-gray-800';
    }
    const colors: Record<Status, string> = {
      'available': "bg-green-100 text-green-800",
      'assigned': "bg-blue-100 text-blue-800",
      'on leave': "bg-yellow-100 text-yellow-800",
    }
    return colors[status];
  }

const columns:ColumnDef<Personnel>[] = [
  {
    id: 'employeeInfo',
    header: 'EMPLOYEE INFO',
    accessorFn: (row) => `${toProperCase(row.first_name)} ${(row.middle_name && row.middle_name !== null) ? row.middle_name.toUpperCase().charAt(0) + "." : ''} ${toProperCase(row.surname)} ${(row.name_extension && row.name_extension !== null) ? row.name_extension.toUpperCase() + '.' : ''}`,
    cell: (({ row }) => (
      <div>
        <p className="font-medium text-gray-900">{row.getValue('employeeInfo')}</p>
        <p className="text-sm text-gray-500">{row.original.email}</p>
      </div>
    ))
  },
  {
    accessorKey: 'roles',
    header: 'ROLES',
    cell: (props) => {
      const { roles } = usePage<PageProps<{ roles: RoleLabels }>>().props;

      return (
        <div className="flex flex-col space-y-2 md:inline md:space-x-2">
          {props.row.original.roles?.map((role) => (
            <span
              key={role.id}
              className="text-center px-2 py-1 md:text-xs font-semibold rounded-xl bg-blue-200"
            >
              {roles[role.name]}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    id: 'status',
    header: 'STATUS',
    accessorKey: 'status',
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        <span className={getStatusColor(row.getValue('status')) + ' inline-flex px-2 py-1 text-xs font-semibold rounded-full'}>{row.getValue('status') ? toProperCase(row.getValue('status')) : 'Unavailable'}</span>
      </div>
    )
  },
  {
    id: 'actions',
    header: 'ACTIONS',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Eye className="h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/personnel/${row.original.id}/activity`}>
              <Clock className="h-4 w-4" />
              View Activity
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

interface Option {
  value: number,
  label: string,
}

export default function ListPersonnel({ personnel, total, sections, roles }: PageProps<{ personnel: Paginator<Personnel>, total: number, sections: Section[], roles: RoleLabels }>) {
  const sectionOptions: Option[] = [
    {value: 0, label: 'All Departments'},
    ...sections.map((section) => {
      return {value: section.id, label: section.name};
    }),
  ];

  const statusOptions: Option[] = [
    {value: 0, label: 'All Statuses'},
    {value: 1, label: 'Active'},
    {value: 2, label: 'On Duty'},
    {value: 3, label: 'On Leave'},
    {value: 4, label: 'On Site'},
  ]
  
  const currentTime = useRealTimeClock()
  const [searchTerm, setSearchTerm] = useState("")

  const stats = {
    total: 15,
    active: 15,
    onDuty: 15,
    onSite: 15,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                {/* {hasActiveFilters && <p className="text-xs text-gray-500">of {total} total</p>} */}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Duty</p>
                <p className="text-2xl font-bold text-gray-900">{stats.onDuty}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On-site</p>
                <p className="text-2xl font-bold text-gray-900">{stats.onSite}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Personnel Directory</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-shrink-0">
                <div className="flex items-center rounded-lg px-3 py-2 5 bg-white min-w-[140px]">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <Select className="w-full border-none"
                    options={sectionOptions}
                    defaultValue={sectionOptions[0]}
                    classNames={{
                      'input': () => 'border-none',
                    }}
                  />
                </div>


                <div className="flex items-center rounded-lg px-3 py-2.5 bg-white min-w-[120px]">
                  
                  <Select className="w-full"
                    options={statusOptions}
                    defaultValue={statusOptions[0]}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {userHasPermission(/personnel\.(?:create|\*)/) && (
                  <div className="flex gap-2">
                    <Link
                      href='/personnel/new'
                      className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white flex items-center gap-2 px-4 py-2.5 rounded-md"
                    >
                      <Plus className="w-4 h-4" />
                      Add Personnel
                    </Link>
                    <Link
                      href='/personnel/import'
                      className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white flex items-center gap-2 px-4 py-2.5 rounded-md"
                    >
                      <Import className="w-4 h-4" />
                      Import Personnel
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={personnel.data}
          noData={(
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Users className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No personnel found</p>
              <p className="text-sm">Add your first team member to get started</p>
            </div>  
          )}
        ></DataTable>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {personnel.from} to {personnel.to} of {total} results
          </p>
          <div className="flex gap-2">
            {personnel.prev_page_url && (
              <Link preserveScroll only={['personnel']} href={personnel.prev_page_url} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Previous
              </Link>
            )}
            {personnel.next_page_url && (
              <Link preserveScroll only={['personnel']} href={personnel.next_page_url} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ListPersonnel.layout = (e: JSX.Element) => <Authenticated children={e} />


