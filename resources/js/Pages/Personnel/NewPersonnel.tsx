"use client"

import InputError from "@/components/InputError"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import toast from "@/components/toast"
import { Head, Link } from "@inertiajs/react"
import { useForm } from "laravel-precognition-react-inertia"
import { ArrowLeft, User, Mail, Phone, Lock, Save, Briefcase, AlertCircle } from "lucide-react"
import { useRef, useState, type FormEventHandler, type MouseEventHandler } from "react"
import Select from "react-select"
import type { PageProps, Role, Section } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Option {
  value: number
  label: string
}

export default function NewPersonnel({ roles, sections }: PageProps<{ roles: Role[]; sections: Section[] }>) {
  const form = useForm<{
    first_name: string
    middle_name: string
    surname: string
    name_extension: string
    email: string
    mobile_number: string
    roles: number[]
    sections: number[]
    password: string
  }>("post", "/personnel/new", {
    first_name: "",
    middle_name: "",
    surname: "",
    name_extension: "",
    email: "",
    mobile_number: "",
    roles: [],
    sections: [],
    password: "",
  })

  form.setValidationTimeout(3000)

  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const roleOptions: Option[] = roles.map((role) => {
    return {
      value: role.id,
      label: role.name,
    }
  })

  const sectionOptions: Option[] = sections.map((section) => {
    return {
      value: section.id,
      label: section.name,
    }
  })

  const generateRandomPassword: MouseEventHandler = (e) => {
    e.preventDefault()

    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let newPassword = ""
    const passwordLength = 8

    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    form.setData("password", newPassword)
  }

  // Form submission with validation
  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    form.submit({
      onSuccess: () => {
        // addToast("success", "Success!", "Personnel has been created successfully")
        toast("success", "Success!", "Personnel has been created successfully")
      },
      onError: (errors) => {
        // addToast("error", "Submission Failed", "There was an error creating the personnel. Please try again.")
        toast("error", "Submission Failed", "There was an error creating the personnel. Please try again.")
      },
      onFinish: () => {
        form.reset("password")
      },
    })
  }

  return (
    <div>
      <Head title="Add New Personnel" />

      <div className="px-6 py-6 bg-gray-50 min-h-screen">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <Link href="/personnel">
                <ArrowLeft className="w-4 h-4" />
                Back to Personnel List
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
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
        <form onSubmit={submit} className="space-y-6" ref={formRef}>
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">Employee photo and basic personal details</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* TODO: FIGURE OUT FILE UPLOADING */}
                {/* Employee Photo Section */}
                <div className="lg:col-span-3">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Employee Photo</Label>
                    <div className="flex flex-col items-center">
                      <div className="w-40 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 hover:border-blue-400 transition-colors cursor-pointer">
                        <div className="text-center">
                          <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 font-medium">Upload Photo</p>
                          <p className="text-xs text-gray-400">Click to browse</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="w-full">
                        Choose File
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        JPG, PNG up to 2MB
                        <br />
                        Recommended: 400x400px
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="lg:col-span-9">
                  <div className="pt-8">
                    <p className="text-sm font-medium text-gray-700 mb-4 block">Full Name</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="surname" className="text-sm font-medium text-gray-700">
                          Surname <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="surname"
                          name="surname"
                          value={form.data.surname}
                          className={`w-full ${form.invalid("surname") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => form.setData("surname", e.target.value)}
                          onBlur={() => form.validate("surname")}
                          placeholder="e.g. Dela Cruz"
                        />
                        {form.invalid("surname") && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{form.errors.surname}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={form.data.first_name}
                          className={`w-full ${form.invalid("first_name") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => form.setData("first_name", e.target.value)}
                          onBlur={() => form.validate("first_name")}
                          placeholder="e.g. Juan"
                        />
                        {form.invalid("first_name") && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{form.errors.first_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="middle_name" className="text-sm font-medium text-gray-700">
                          Middle Name
                        </Label>
                        <Input
                          id="middle_name"
                          name="middle_name"
                          value={form.data.middle_name}
                          className={`w-full ${form.invalid("middle_name") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => form.setData("middle_name", e.target.value)}
                          onBlur={() => form.validate("middle_name")}
                          placeholder="e.g. Reyes"
                        />
                        {form.invalid("middle_name") && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{form.errors.middle_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="name_extension" className="text-sm font-medium text-gray-700">
                          Extension
                        </Label>
                        <Input
                          id="name_extension"
                          name="name_extension"
                          value={form.data.name_extension}
                          className={`w-full ${form.invalid("name_extension") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => form.setData("name_extension", e.target.value)}
                          onBlur={() => form.validate("name_extension")}
                          placeholder="e.g. Jr, Sr, III"
                        />
                        {form.invalid("name_extension") && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{form.errors.name_extension}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organization Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Organization Information</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">Employee position and department details</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Position Field */}
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                    Position/Role <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    options={roleOptions}
                    isMulti
                    isClearable
                    required
                    closeMenuOnSelect={false}
                    name="roles"
                    value={roleOptions.filter((role) => form.data.roles.includes(role.value))}
                    onChange={(newRoles) =>
                      form.setData("roles", newRoles ? newRoles.map((newRole) => newRole.value) : [])
                    }
                    onBlur={() => form.validate("roles")}
                  />

                  {form.invalid("roles") && <InputError message={form.errors.roles} />}
                </div>

                {/* Department Field */}
                <div className="space-y-2">
                  <Label htmlFor="sections" className="text-sm font-medium text-gray-700">
                    Section <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    options={sectionOptions}
                    isMulti
                    isClearable
                    required
                    closeMenuOnSelect={false}
                    name="sections"
                    value={sectionOptions.filter((section) => form.data.sections.includes(section.value))}
                    onChange={(newSections) =>
                      form.setData("sections", newSections ? newSections.map((newSection) => newSection.value) : [])
                    }
                    onBlur={() => form.validate("sections")}
                  />

                  {form.invalid("sections") && <InputError message={form.errors.sections} />}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">Email and phone number</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Details */}
                <div className="space-y-4">
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
                        value={form.data.email}
                        className={`pl-10 w-full ${form.invalid("email") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        onChange={(e) => form.setData("email", e.target.value)}
                        onBlur={() => form.validate("email")}
                        placeholder="e.g. juan.delacruz@cdrrmo.gov.ph"
                      />
                    </div>
                    {form.invalid("email") && <InputError message={form.errors.email} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile_number" className="text-sm font-medium text-gray-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <div className="flex items-center justify-center px-3 py-2 bg-gray-50 border border-gray-300 rounded-l-md text-sm text-gray-700 font-medium min-w-[60px] h-10">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        +63
                      </div>
                      <Input
                        id="mobile_number"
                        name="mobile_number"
                        value={form.data.mobile_number}
                        className={`rounded-l-none border-l-0 flex-1 h-10 ${form.invalid("mobile_number") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                        onChange={(e) => form.setData("mobile_number", e.target.value)}
                        onBlur={() => form.validate("mobile_number")}
                        placeholder="9123456789"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {form.invalid("mobile_number") && <InputError message={form.errors.mobile_number} />}
                  <p className="text-xs text-gray-500">Enter 10 digits after +63 (e.g., +639123456789)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Account security</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">Initial password</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Initial Account Password <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="password"
                            type="text"
                            name="password"
                            value={form.data.password}
                            className="pl-10 w-full"
                            placeholder="test"
                            readOnly
                          />
                        </div>
                        <Button onClick={generateRandomPassword}>Generate Random Password</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="text-red-500">*</span> Required fields
              </div>

              <div className="flex gap-3">
                <Button variant="outline" type="button" asChild>
                  <Link href="/personnel">Cancel</Link>
                </Button>

                <Button
                  type="button"
                  className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white flex items-center gap-2 px-6"
                  onClick={() => {
                    console.log("boutta validate?")
                    form.validate({
                      only: [
                        "first_name",
                        "surname",
                        "middle_name",
                        "name_extension",
                        "email",
                        "mobile_number",
                        "roles",
                        "sections",
                        "password",
                      ],
                      onSuccess: () => {
                        setConfirmDialogOpen(true)
                        console.log(form.data)
                      },
                      onValidationError: () => {
                        toast(
                          "error",
                          "Submission Failed",
                          "There was an error creating the personnel. Please try again.",
                        )
                      },
                    })
                  }}
                >
                  <Save className="w-4 h-4" />
                  Create Personnel
                </Button>

                <Dialog open={isConfirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                  <DialogContent className="max-w-5xl">
                    <DialogHeader>
                      <DialogTitle>Confirm Personnel Details</DialogTitle>
                      <DialogDescription>Please review the personnel information before submitting</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                      {/* Personal Information Preview */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-blue-50 px-4 py-2 border-b">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <h3 className="font-medium text-gray-900">Personal Information</h3>
                          </div>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">
                              {form.data.surname}, {form.data.first_name} {form.data.middle_name}{" "}
                              {form.data.name_extension}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Organization Information Preview */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-green-50 px-4 py-2 border-b">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-green-600" />
                            <h3 className="font-medium text-gray-900">Organization Information</h3>
                          </div>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Position/Role</p>
                            <p className="font-medium">
                              {roleOptions
                                .filter((role) => form.data.roles.includes(role.value))
                                .map((role) => role.label)
                                .join(", ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Section</p>
                            <p className="font-medium">
                              {sectionOptions
                                .filter((section) => form.data.sections.includes(section.value))
                                .map((section) => section.label)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information Preview */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-purple-50 px-4 py-2 border-b">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-purple-600" />
                            <h3 className="font-medium text-gray-900">Contact Information</h3>
                          </div>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium">{form.data.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Mobile Number</p>
                            <p className="font-medium">+63{form.data.mobile_number}</p>
                          </div>
                        </div>
                      </div>

                      {/* Account Security Preview */}
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-red-50 px-4 py-2 border-b">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-red-600" />
                            <h3 className="font-medium text-gray-900">Account Security</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <div>
                            <p className="text-sm text-gray-500">Initial Password</p>
                            <p className="font-medium">{form.data.password}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button type="button" variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                        Go Back & Edit
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white"
                        onClick={() => {
                          formRef.current?.submit()
                          setConfirmDialogOpen(false)
                        }}
                      >
                        Confirm & Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

NewPersonnel.layout = (e: JSX.Element) => <Authenticated children={e} />
