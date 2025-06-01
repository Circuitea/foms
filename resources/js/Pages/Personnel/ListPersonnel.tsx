"use client"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import type { PageProps, Personnel } from "@/types"
import { Head, Link } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Search, Filter, Plus, Users, UserCheck, Clock, Eye, Edit, Trash2, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

const columns: ColumnDef<Personnel>[] = [
  {
    accessorKey: "first_name",
    header: () => <div className="text-white font-semibold">Employee</div>,
    cell: ({ row }) => {
      const firstName = row.getValue("first_name") as string
      const surname = row.original.surname || ""
      const email = row.original.email
      return (
        <div className="flex flex-col">
          <div className="font-medium text-gray-900">{`${firstName} ${surname}`}</div>
          <div className="text-sm text-gray-500">{email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "department",
    header: () => <div className="text-white font-semibold">Department</div>,
    cell: () => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        Others
      </span>
    ),
  },
  {
    accessorKey: "job_title",
    header: () => <div className="text-white font-semibold">Position</div>,
    cell: ({ row }) => {
      const role = row.original.roles?.[0]?.name || "N/A"
      return <div className="font-medium text-gray-700">{role}</div>
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-white font-semibold">Status</div>,
    cell: () => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        Active
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: () => <div className="text-white font-semibold">Location</div>,
    cell: () => (
      <div className="flex items-center text-gray-600">
        <MapPin className="w-4 h-4 mr-1" />
        On-site
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-white font-semibold text-center">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Clock className="mr-2 h-4 w-4" />
                View Schedule
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

interface PaginatedPersonnel {
  data: Personnel[]
  link: {
    active: boolean
    label: string
    url?: string
  }[]
}

export default function ListPersonnel({ personnel }: PageProps<{ personnel?: PaginatedPersonnel }>) {
  const [currentTime, setCurrentTime] = useState(getCurrentTime())
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const tableData = personnel?.data || []

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      <Head title="Staff Management - Personnel List" />
      <div className="px-6 py-6 bg-gray-50">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
              <p className="text-gray-600">Manage and monitor your organization's personnel</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Current Time</div>
              <div className="text-lg font-semibold text-gray-900">{currentTime}</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900">{tableData.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{tableData.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(tableData.length * 0.8)}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{Math.floor(tableData.length * 0.9)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Personnel Directory</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2 flex-shrink-0">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white min-w-[140px]">
                  <Filter className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="border-none outline-none bg-transparent text-sm w-full"
                  >
                    <option value="all">All Departments</option>
                    <option value="it">IT</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 bg-white min-w-[100px]">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border-none outline-none bg-transparent text-sm w-full"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <Button className="bg-red-700 hover:bg-red-800 text-white flex items-center gap-2 px-4 py-2.5" asChild>
                  <Link href="/personnel/track">
                    <MapPin className="w-4 h-4" />
                    Track Employees
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white flex items-center gap-2 px-4 py-2.5"
                >
                  <Link href="/personnel/new">
                    <Plus className="w-4 h-4" />
                    Add Personnel
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={tableData}
              className="[&_thead]:bg-[#1B2560] [&_thead_tr]:border-0 [&_thead_tr:hover]:bg-[#1B2560] [&_tbody_tr]:border-b [&_tbody_tr]:border-gray-100 [&_tbody_tr:hover]:bg-transparent"
            />
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {tableData.length > 0 ? 1 : 0} to {tableData.length} of {tableData.length} results
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

ListPersonnel.layout = (e: JSX.Element) => <Authenticated children={e} />

function getCurrentTime() {
  const date = new Date()
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date)
}
