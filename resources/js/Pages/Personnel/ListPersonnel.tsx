"use client"

import { useState, useEffect } from "react"
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
  User,
} from "lucide-react"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { PageProps, Personnel, Section, Status } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Select from 'react-select';
import { toProperCase, userHasPermission } from "@/lib/utils"


const getStatusColor = (status: Status | null) => {
    if (!status) {
      return 'bg-gray-100 text-gray-800';
    }
    const colors: Record<Status, string> = {
      'active': "bg-green-100 text-green-800",
      'on duty': "bg-blue-100 text-blue-800",
      'on site': "bg-purple-100 text-purple-800",
      'on leave': "bg-yellow-100 text-yellow-800",
    }
    return colors[status];
  }

function getColumnDef(roleLabels: RoleLabels): ColumnDef<Personnel>[] {
  return [
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
    // {
    //   id: 'sections',
    //   accessorKey: 'sections',
    //   header: 'SECTIONS',
    //   cell: (props) => props.row.original.sections?.map((section) => (
    //     <span key={section.id}>{section.name}</span>
    //   ))
    // },
    {
      accessorKey: 'roles',
      header: 'ROLES',
      cell: (props) => (
        <div className="flex flex-col space-y-2 md:inline md:space-x-2">
          {props.row.original.roles?.map((role) => (
            <span
              key={role.id}
              className="text-center px-2 py-1 md:text-xs font-semibold rounded-xl bg-blue-200"
            >
              {roleLabels[role.name]}
            </span>
          ))}
        </div>
      ),
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
      id: 'location',
      header: 'LOCATION',
      accessorFn: () => 'There',
      cell: (props) => (
        <div className="flex">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{props.row.getValue('location')}</span>
        </div>
      )
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      cell: (props) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Eye className="h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="h-4 w-4" />
              View Schedule
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 className="h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]
}

// Real-time clock hook
function useRealTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return `${formatDate(currentTime)}, ${formatTime(currentTime)}`
}

interface PersonnelPaginatorProps {
  data: Personnel[],
  
  from: number,
  to: number,
  per_page: number,
  
  prev_page_url?: string,
  next_page_url?: string,

  current_page: number,
  current_page_url: string,
  first_page_url: string,
}

interface Option {
  value: number,
  label: string,
}

type RoleLabels = {
  [key: string]: string;
}

export default function ListPersonnel({ personnel, total, sections, roles }: PageProps<{ personnel: PersonnelPaginatorProps, total: number, sections: Section[], roles: RoleLabels }>) {
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
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [showTrackEmployeesModal, setShowTrackEmployeesModal] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    surname: "",
    email: "",
    department: "",
    position: "",
    status: "Active",
    location: "On-site",
  })
  const [showPersonnelDetailModal, setShowPersonnelDetailModal] = useState(false)
  const [selectedPersonnelForDetail, setSelectedPersonnelForDetail] = useState<Personnel | null>(null)

  const stats = {
    total: 15,
    active: 15,
    onDuty: 15,
    onSite: 15,
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-green-100 text-green-800",
      "On Duty": "bg-blue-100 text-blue-800",
      "On-site": "bg-purple-100 text-purple-800",
      Inactive: "bg-gray-100 text-gray-800",
      "On Leave": "bg-yellow-100 text-yellow-800",
    }
    return colors[status] || colors["Active"]
  }

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-green-500",
      "On Duty": "bg-blue-500",
      "On-site": "bg-purple-500",
      Inactive: "bg-gray-500",
      "On Leave": "bg-yellow-500",
    }
    return colors[status] || colors["Active"]
  }

  // const exportToExcel = () => {
  //   const activePersonnel = filteredData.filter((p) => ["Active", "On Duty", "On-site"].includes(p.status || ""))

  //   const exportData = activePersonnel.map((person) => {
  //     const locationHistory = mockLocationHistory[person.id] || []
  //     const currentTime = new Date().toLocaleString("en-US", {
  //       year: "numeric",
  //       month: "2-digit",
  //       day: "2-digit",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //       second: "2-digit",
  //       hour12: true,
  //     })

  //     return {
  //       "Full Name": `${person.first_name} ${person.surname || ""}`,
  //       Position: person.roles?.[0]?.name || "N/A",
  //       Department: person.department || "Others",
  //       "Current Status": person.status || "Active",
  //       "Current Location": person.location || "On-site",
  //       "Recent Locations": locationHistory
  //         .slice(0, 3)
  //         .map((loc) => `${loc.relativePlace} (${loc.timestamp})`)
  //         .join("; "),
  //       "Total Location Changes": locationHistory.length,
  //       "Last Location Update": locationHistory[0]?.timestamp || "No history",
  //       "Export Time": currentTime,
  //     }
  //   })

  //   // Create CSV content
  //   const headers = Object.keys(exportData[0] || {})
  //   const csvContent = [
  //     headers.join(","),
  //     ...exportData.map((row) => headers.map((header) => `"${row[header as keyof typeof row] || ""}"`).join(",")),
  //   ].join("\n")

  //   // Download CSV file
  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  //   const link = document.createElement("a")
  //   const url = URL.createObjectURL(blob)
  //   link.setAttribute("href", url)
  //   link.setAttribute("download", `personnel_tracking_report_${new Date().toISOString().split("T")[0]}.csv`)
  //   link.style.visibility = "hidden"
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)

  //   alert(`Exported ${exportData.length} personnel records to CSV file`)
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#1B2560] border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-white" />
              <h1 className="text-xl font-semibold text-white">Staff Management</h1>
            </div>
            <div className="text-sm font-mono text-white">{currentTime}</div>
          </div>
          <div className="mt-2 text-sm text-gray-300">CDRRMO Staff Portal › Personnel Directory</div>
        </div>
      </div>

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
                <Button
                  onClick={() => setShowTrackEmployeesModal(true)}
                  className="bg-red-700 hover:bg-red-800 text-white flex items-center gap-2 px-4 py-2.5 rounded-md"
                >
                  <MapPin className="w-4 h-4" />
                  Track Employees
                </Button>
                
                {userHasPermission(/personnel\.(?:create|\*)/) && (
                  <Link
                    href='/personnel/new'
                    className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white flex items-center gap-2 px-4 py-2.5 rounded-md"
                  >
                    <Plus className="w-4 h-4" />
                    Add Personnel
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <DataTable
          columns={getColumnDef(roles)}
          data={personnel.data}
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
      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Personnel</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={newEmployee.first_name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newEmployee.surname}
                    onChange={(e) => setNewEmployee({ ...newEmployee, surname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Operations">Operations</option>
                  <option value="Medical">Medical</option>
                  <option value="Communications">Communications</option>
                  <option value="Logistics">Logistics</option>
                  <option value="IT">IT</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                <input
                  type="text"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter job position"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Duty">On Duty</option>
                    <option value="On-site">On-site</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={newEmployee.location}
                    onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Field">Field</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newEmployee.first_name && newEmployee.email && newEmployee.department && newEmployee.position) {
                    // Add the new employee to the list (in a real app, this would be an API call)
                    console.log("Adding new employee:", newEmployee)
                    alert("Employee added successfully!")
                    setNewEmployee({
                      first_name: "",
                      surname: "",
                      email: "",
                      department: "",
                      position: "",
                      status: "Active",
                      location: "On-site",
                    })
                    setShowAddEmployeeModal(false)
                  } else {
                    alert("Please fill in all required fields")
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Track Employees Modal */}
      {showTrackEmployeesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Employee Location Tracking</h3>
              </div>
              <button onClick={() => setShowTrackEmployeesModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
                    <p className="text-gray-600">Real-time employee location tracking would be displayed here</p>
                  </div>
                </div>

                {/* Employee List */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Active Personnel Locations</h4>
                  {filteredData
                    .filter((p) => ["Active", "On Duty", "On-site"].includes(p.status || ""))
                    .map((person) => (
                      <div key={person.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">
                              {person.first_name} {person.surname}
                            </h5>
                            <p className="text-sm text-gray-600">{person.roles?.[0]?.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {person.location}
                            </div>
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(person.status || "Active")}`}
                            >
                              <div
                                className={`w-2 h-2 ${getStatusDot(person.status || "Active")} rounded-full mr-1`}
                              ></div>
                              {person.status}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              setSelectedPersonnelForDetail(person)
                              setShowPersonnelDetailModal(true)
                            }}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredData.filter((p) => p.location === "On-site").length}
                  </div>
                  <div className="text-sm text-green-700">On-site</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredData.filter((p) => p.location === "Field").length}
                  </div>
                  <div className="text-sm text-blue-700">In Field</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {filteredData.filter((p) => p.location === "Remote").length}
                  </div>
                  <div className="text-sm text-purple-700">Remote</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowTrackEmployeesModal(false)}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button onClick={exportToExcel} className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personnel Detail Modal */}
      {showPersonnelDetailModal && selectedPersonnelForDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedPersonnelForDetail.first_name} {selectedPersonnelForDetail.surname}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedPersonnelForDetail.roles?.[0]?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowPersonnelDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Current Status */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Current Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPersonnelForDetail.status || "Active")}`}
                    >
                      <div
                        className={`w-2 h-2 ${getStatusDot(selectedPersonnelForDetail.status || "Active")} rounded-full mr-1`}
                      ></div>
                      {selectedPersonnelForDetail.status || "Active"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Location</p>
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedPersonnelForDetail.location || "On-site"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location History */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recent Location History</h4>
                <div className="space-y-3">
                  {(mockLocationHistory[selectedPersonnelForDetail.id] || []).map((location, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-3 h-3 rounded-full ${index === 0 ? "bg-green-500" : "bg-gray-400"}`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">{location.relativePlace}</h5>
                          <span className="text-xs text-gray-500">{location.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Location: {location.location}</p>
                        {index === 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                            Current Location
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!mockLocationHistory[selectedPersonnelForDetail.id] ||
                    mockLocationHistory[selectedPersonnelForDetail.id].length === 0) && (
                    <div className="text-center py-8">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500">No location history available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPersonnelDetailModal(false)}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

ListPersonnel.layout = (e: JSX.Element) => <Authenticated children={e} />


