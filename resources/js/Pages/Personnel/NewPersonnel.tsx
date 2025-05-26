"use client"

import InputError from "@/components/InputError"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Loader2,
  Briefcase,
  ChevronDown,
  Check,
  Building,
} from "lucide-react"
import type { FormEventHandler } from "react"
import { useState } from "react"

const positions = ["IT Staff", "Administrative Staff", "Logistic Staff"]

const departments = [
  "Administration",
  "IT Department",
  "Logistic",
]

export default function NewPersonnel() {
  const { data, setData, processing, errors, post, reset } = useForm({
    first_name: "",
    middle_name: "",
    surname: "",
    name_extension: "",
    email: "",
    mobile_number: "",
    position: "",
    department: "",
    password: "",
  })

  // Position dropdown states
  const [isPositionOpen, setIsPositionOpen] = useState(false)
  const [positionSearch, setPositionSearch] = useState("")

  // Department dropdown states
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false)
  const [departmentSearch, setDepartmentSearch] = useState("")

  const filteredPositions = positions.filter((position) =>
    position.toLowerCase().includes(positionSearch.toLowerCase()),
  )

  const filteredDepartments = departments.filter((department) =>
    department.toLowerCase().includes(departmentSearch.toLowerCase()),
  )

  const handlePositionSelect = (position: string) => {
    setData("position", position)
    setPositionSearch(position)
    setIsPositionOpen(false)
  }

  const handlePositionInputChange = (value: string) => {
    setPositionSearch(value)
    setData("position", value)
    setIsPositionOpen(true)
  }

  const handleDepartmentSelect = (department: string) => {
    setData("department", department)
    setDepartmentSearch(department)
    setIsDepartmentOpen(false)
  }

  const handleDepartmentInputChange = (value: string) => {
    setDepartmentSearch(value)
    setData("department", value)
    setIsDepartmentOpen(true)
  }

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post("/personnel/new", {
      onFinish: () => {
        reset("password")
      },
    })
  }

  return (
    <Authenticated>
      <Head title="Add New Personnel" />
      <div className="px-6 py-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link href="/personnel">
                <ArrowLeft className="w-4 h-4" />
                Back to Personnel List
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Personnel</h1>
              <p className="text-gray-600">Create a new employee profile for your organization</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Employee Information</h3>
              <p className="text-sm text-gray-600 mt-1">
                Please fill in all required fields to create the employee profile
              </p>
            </div>

            <div className="p-6">
              <form onSubmit={submit} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-gray-600" />
                    <h4 className="text-md font-medium text-gray-900">Personal Information</h4>
                  </div>

                  {/* Name Fields Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="surname" className="text-sm font-medium text-gray-700">
                        Surname <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="surname"
                        name="surname"
                        value={data.surname}
                        className="w-full"
                        onChange={(e) => setData("surname", e.target.value)}
                        placeholder="e.g. Dela Cruz"
                      />
                      <InputError message={errors.surname} className="text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={data.first_name}
                        className="w-full"
                        onChange={(e) => setData("first_name", e.target.value)}
                        placeholder="e.g. Juan"
                      />
                      <InputError message={errors.first_name} className="text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="middle_name" className="text-sm font-medium text-gray-700">
                        Middle Name
                      </Label>
                      <Input
                        id="middle_name"
                        name="middle_name"
                        value={data.middle_name}
                        className="w-full"
                        onChange={(e) => setData("middle_name", e.target.value)}
                        placeholder="e.g. Reyes"
                      />
                      <InputError message={errors.middle_name} className="text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name_extension" className="text-sm font-medium text-gray-700">
                        Extension
                      </Label>
                      <Input
                        id="name_extension"
                        name="name_extension"
                        value={data.name_extension}
                        className="w-full"
                        onChange={(e) => setData("name_extension", e.target.value)}
                        placeholder="e.g. Jr, Sr, III"
                      />
                      <InputError message={errors.name_extension} className="text-xs" />
                    </div>
                  </div>
                </div>

                {/* Organization Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    <h4 className="text-md font-medium text-gray-900">Organization Information</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Searchable Position Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                        Position/Role <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                        <Input
                          id="position"
                          name="position"
                          value={positionSearch}
                          onChange={(e) => handlePositionInputChange(e.target.value)}
                          onFocus={() => setIsPositionOpen(true)}
                          className="w-full pl-10 pr-10"
                          placeholder="Type to search or select position..."
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => setIsPositionOpen(!isPositionOpen)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isPositionOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Position Dropdown Options */}
                        {isPositionOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredPositions.length > 0 ? (
                              filteredPositions.map((position, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handlePositionSelect(position)}
                                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between group"
                                >
                                  <span className="text-sm">{position}</span>
                                  {data.position === position && <Check className="h-4 w-4 text-blue-600" />}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No positions found. You can type a custom position.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <InputError message={errors.position} className="text-xs" />
                      <p className="text-xs text-gray-500">
                        Start typing to see suggestions or enter a custom position
                      </p>
                    </div>

                    {/* Searchable Department Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                        Department <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                        <Input
                          id="department"
                          name="department"
                          value={departmentSearch}
                          onChange={(e) => handleDepartmentInputChange(e.target.value)}
                          onFocus={() => setIsDepartmentOpen(true)}
                          className="w-full pl-10 pr-10"
                          placeholder="Type to search or select department..."
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isDepartmentOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Department Dropdown Options */}
                        {isDepartmentOpen && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredDepartments.length > 0 ? (
                              filteredDepartments.map((department, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleDepartmentSelect(department)}
                                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center justify-between group"
                                >
                                  <span className="text-sm">{department}</span>
                                  {data.department === department && <Check className="h-4 w-4 text-blue-600" />}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-sm text-gray-500">
                                No departments found. You can type a custom department.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <InputError message={errors.department} className="text-xs" />
                      <p className="text-xs text-gray-500">
                        Start typing to see suggestions or enter a custom department
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <h4 className="text-md font-medium text-gray-900">Contact Information</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          value={data.email}
                          className="pl-10 w-full"
                          onChange={(e) => setData("email", e.target.value)}
                          placeholder="e.g. juan.delacruz@cdrrmo.gov.ph"
                        />
                      </div>
                      <InputError message={errors.email} className="text-xs" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile_number" className="text-sm font-medium text-gray-700">
                        Mobile Number <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="mobile_number"
                          name="mobile_number"
                          value={data.mobile_number}
                          className="pl-10 w-full"
                          onChange={(e) => setData("mobile_number", e.target.value)}
                          placeholder="e.g. 09123456789"
                        />
                      </div>
                      <InputError message={errors.mobile_number} className="text-xs" />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <h4 className="text-md font-medium text-gray-900">Account Security</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={data.password}
                          className="pl-10 w-full"
                          onChange={(e) => setData("password", e.target.value)}
                          placeholder="Enter a secure password"
                        />
                      </div>
                      <InputError message={errors.password} className="text-xs" />
                      <p className="text-xs text-gray-500">Password should be at least 8 characters long</p>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="text-red-500">*</span> Required fields
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" type="button" asChild>
                      <Link href="/personnel">Cancel</Link>
                    </Button>

                    <Button
                      type="submit"
                      disabled={processing}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Create Personnel
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(isPositionOpen || isDepartmentOpen) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsPositionOpen(false)
              setIsDepartmentOpen(false)
            }}
          />
        )}
      </div>
    </Authenticated>
  )
}
