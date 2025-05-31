"use client"

import InputError from "@/components/InputError"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Authenticated from "@/Layouts/AuthenticatedLayout"
import toast from "@/components/toast";
import { Head, Link } from "@inertiajs/react"
import { useForm } from 'laravel-precognition-react-inertia';
import { ArrowLeft, User, Mail, Phone, Lock, Save, Loader2, Briefcase, ChevronDown, Check, Building, AlertCircle, X } from 'lucide-react'
import type { FormEventHandler } from "react"
import { useState, useEffect } from "react"

const positions = ["IT Staff", "Administrative Staff", "Logistic Staff"]

const departments = ["Administration", "IT Department", "Logistic"]

// Position to Department mapping
const positionDepartmentMapping: Record<string, string> = {
  "IT Staff": "IT Department",
  "Administrative Staff": "Administration",
  "Logistic Staff": "Logistic",
}

// Department to positions mapping (for filtering)
const departmentPositionsMapping: Record<string, string[]> = {
  "IT Department": ["IT Staff"],
  Administration: ["Administrative Staff"],
  Logistic: ["Logistic Staff"],
}

interface ValidationErrors {
  [key: string]: string
}

interface Toast {
  id: string
  type: "error" | "success" | "warning"
  title: string
  message: string
}

export default function NewPersonnel() {
  const { data, setData, processing, errors, submit, reset, validate, invalid, setValidationTimeout } = useForm('post', '/personnel/new', {
    first_name: "",
    middle_name: "",
    surname: "",
    name_extension: "",
    email: "",
    mobile_number: "",
    position: "",
    department: "",
    password: "",
  });

  setValidationTimeout(3000);

  // Position dropdown states
  const [isPositionOpen, setIsPositionOpen] = useState(false)
  const [positionSearch, setPositionSearch] = useState("")

  // Department dropdown states
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false)
  const [departmentSearch, setDepartmentSearch] = useState("")

  // Validation states
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [toasts, setToasts] = useState<Toast[]>([])

  const filteredPositions = positions.filter((position) =>
    position.toLowerCase().includes(positionSearch.toLowerCase()),
  )

  // Filter departments based on selected position
  const getAvailableDepartments = () => {
    if (data.position && positionDepartmentMapping[data.position]) {
      // If position is selected and has a mapping, only show the mapped department
      return [positionDepartmentMapping[data.position]]
    }
    // Otherwise show all departments
    return departments
  }

  const filteredDepartments = getAvailableDepartments().filter((department) =>
    department.toLowerCase().includes(departmentSearch.toLowerCase()),
  )

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return "Email address is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return null
  }

  const validateMobileNumber = (mobile: string): string | null => {
    if (!mobile) return "Mobile number is required"
    if (!/^[0-9]+$/.test(mobile)) return "Mobile number should only contain numbers"
    if (mobile.length !== 10) return "Please enter exactly 10 digits after +63"
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters long"
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter"
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter"
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number"
    return null
  }

  const validateName = (name: string, fieldName: string, required = true): string | null => {
    if (required && !name) return `${fieldName} is required`
    if (name && !/^[a-zA-Z\s\-.]+$/.test(name))
      return `${fieldName} should only contain letters, spaces, hyphens, and periods`
    if (name && name.length > 50) return `${fieldName} should not exceed 50 characters`
    return null
  }

  const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === "") return `${fieldName} is required`
    return null
  }

  // Real-time validation
  const handleFieldValidation = (field: string, value: string) => {
    let error: string | null = null

    switch (field) {
      case "first_name":
        error = validateName(value, "First name")
        break
      case "surname":
        error = validateName(value, "Surname")
        break
      case "middle_name":
        error = validateName(value, "Middle name", false)
        break
      case "name_extension":
        error = validateName(value, "Name extension", false)
        break
      case "email":
        error = validateEmail(value)
        break
      case "mobile_number":
        error = validateMobileNumber(value)
        break
      case "password":
        error = validatePassword(value)
        break
      case "position":
        error = validateRequired(value, "Position")
        break
      case "department":
        error = validateRequired(value, "Department")
        break
    }

    setValidationErrors((prev) => ({
      ...prev,
      [field]: error || "",
    }))
  }

  // Handle input changes with validation
  const handleInputChange = (field: string, value: string) => {
    setData(field as any, value)
    handleFieldValidation(field, value)
  }

  const handleMobileNumberChange = (value: string) => {
    // Only allow numbers
    const numbersOnly = value.replace(/[^0-9]/g, "")
    // Limit to 10 digits (after +63)
    const limitedValue = numbersOnly.slice(0, 10)

    if (value !== numbersOnly) {
      toast('error', 'Invalid Input', "Mobile number should only contain numbers");
    }

    handleInputChange("mobile_number", limitedValue)
  }

  const handlePositionSelect = (position: string) => {
    setData("position", position)
    setPositionSearch(position)
    setIsPositionOpen(false)
    handleFieldValidation("position", position)

    // Auto-set department based on position
    const mappedDepartment = positionDepartmentMapping[position]
    if (mappedDepartment) {
      setData("department", mappedDepartment)
      setDepartmentSearch(mappedDepartment)
      handleFieldValidation("department", mappedDepartment)

      toast(
        'success',
        'Department Auto Selected',
        `${mappedDepartment} has been automatically selected for ${position}`,
      );
    }
  }

  const handlePositionInputChange = (value: string) => {
    setPositionSearch(value)
    setData("position", value)
    setIsPositionOpen(true)
    handleFieldValidation("position", value)

    // If user is typing a custom position, clear the department auto-selection
    if (!positionDepartmentMapping[value]) {
      // Only clear if the current department was auto-selected
      const currentDepartment = data.department
      if (currentDepartment && Object.values(positionDepartmentMapping).includes(currentDepartment)) {
        setData("department", "")
        setDepartmentSearch("")
      }
    }
  }

  const handleDepartmentSelect = (department: string) => {
    setData("department", department)
    setDepartmentSearch(department)
    setIsDepartmentOpen(false)
    handleFieldValidation("department", department)
  }

  const handleDepartmentInputChange = (value: string) => {
    setDepartmentSearch(value)
    setData("department", value)
    setIsDepartmentOpen(true)
    handleFieldValidation("department", value)
  }

  // Form submission with validation
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()

    // // Validate all fields
    // const allErrors: ValidationErrors = {}

    // allErrors.first_name = validateName(data.first_name, "First name") || ""
    // allErrors.surname = validateName(data.surname, "Surname") || ""
    // allErrors.middle_name = validateName(data.middle_name, "Middle name", false) || ""
    // allErrors.name_extension = validateName(data.name_extension, "Name extension", false) || ""
    // allErrors.email = validateEmail(data.email) || ""
    // allErrors.mobile_number = validateMobileNumber(data.mobile_number) || ""
    // allErrors.password = validatePassword(data.password) || ""
    // allErrors.position = validateRequired(data.position, "Position") || ""
    // allErrors.department = validateRequired(data.department, "Department") || ""

    // setValidationErrors(allErrors)

    // // Check if there are any errors
    // const hasErrors = Object.values(allErrors).some((error) => error !== "")

    // if (hasErrors) {
    //   const errorCount = Object.values(allErrors).filter((error) => error !== "").length
    //   // addToast(
    //   //   "error",
    //   //   "Form Validation Failed",
    //   //   `Please fix ${errorCount} error${errorCount > 1 ? "s" : ""} before submitting`,
    //   // )
    //   toast('error', 'Form Validation Failed', `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting`);

    //   // Scroll to first error
    //   const firstErrorField = Object.keys(allErrors).find((key) => allErrors[key] !== "")
    //   if (firstErrorField) {
    //     const element = document.getElementById(firstErrorField)
    //     element?.scrollIntoView({ behavior: "smooth", block: "center" })
    //     element?.focus()
    //   }
    //   return
    // }

    // If no validation errors, proceed with submission
    submit({
      onSuccess: () => {
        // addToast("success", "Success!", "Personnel has been created successfully")
        toast('success', 'Success!', 'Personnel has been created successfully');
      },
      onError: (errors) => {
        // addToast("error", "Submission Failed", "There was an error creating the personnel. Please try again.")
        toast('error', 'Submission Failed', 'There was an error creating the personnel. Please try again.');
      },
      onFinish: () => {
        reset("password")
      },
    })
  }

  // Initialize validation on mount
  useEffect(() => {
    if (data.position) setPositionSearch(data.position)
    if (data.department) setDepartmentSearch(data.department)
  }, [])

  return (
    <Authenticated>
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
                          value={data.surname}
                          className={`w-full ${invalid('surname') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => setData('surname', e.target.value)}
                          onBlur={() => validate('surname')}
                          placeholder="e.g. Dela Cruz"
                        />
                        {invalid('surname') && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{errors.surname}</span>
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
                          value={data.first_name}
                          className={`w-full ${invalid('first_name') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => setData("first_name", e.target.value)}
                          onBlur={() => validate('first_name')}
                          placeholder="e.g. Juan"
                        />
                        {invalid('first_name') && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{errors.first_name}</span>
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
                          value={data.middle_name}
                          className={`w-full ${validationErrors.middle_name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => setData("middle_name", e.target.value)}
                          onBlur={() => validate('middle_name')}
                          placeholder="e.g. Reyes"
                        />
                        {invalid('middle_name') && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{errors.middle_name}</span>
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
                          value={data.name_extension}
                          className={`w-full ${validationErrors.name_extension ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => setData("name_extension", e.target.value)}
                          onBlur={() => validate('name_extension')}
                          placeholder="e.g. Jr, Sr, III"
                        />
                        {invalid('name_extension') && (
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="break-words">{errors.name_extension}</span>
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
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                    <Input
                      id="position"
                      name="position"
                      value={positionSearch}
                      onChange={(e) => handlePositionInputChange(e.target.value)}
                      onFocus={() => setIsPositionOpen(true)}
                      className={`w-full pl-10 pr-16 ${validationErrors.position ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      placeholder="Type to search or select position..."
                      autoComplete="off"
                    />

                    {/* Clear button */}
                    {positionSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setPositionSearch("")
                          setData("position", "")
                          setData("department", "")
                          setDepartmentSearch("")
                          handleFieldValidation("position", "")
                          handleFieldValidation("department", "")
                          setIsPositionOpen(false)
                        }}
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsPositionOpen(!isPositionOpen)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isPositionOpen ? "rotate-180" : ""}`} />
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
                  {validationErrors.position && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{validationErrors.position}</span>
                    </div>
                  )}
                  <InputError message={errors.position} className="text-xs" />
                  <p className="text-xs text-gray-500">Start typing to see suggestions or enter a custom position</p>
                </div>

                {/* Department Field */}
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
                      className={`w-full pl-10 pr-16 ${validationErrors.department ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                      placeholder={
                        data.position && positionDepartmentMapping[data.position]
                          ? `Auto-selected: ${positionDepartmentMapping[data.position]}`
                          : "Type to search or select department..."
                      }
                      autoComplete="off"
                    />

                    {/* Clear button */}
                    {departmentSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setDepartmentSearch("")
                          setData("department", "")
                          handleFieldValidation("department", "")
                          setIsDepartmentOpen(false)
                        }}
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${isDepartmentOpen ? "rotate-180" : ""}`} />
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
                            {data.position && positionDepartmentMapping[data.position]
                              ? `Only ${positionDepartmentMapping[data.position]} is available for ${data.position}`
                              : "No departments found. You can type a custom department."}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {validationErrors.department && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{validationErrors.department}</span>
                    </div>
                  )}
                  <InputError message={errors.department} className="text-xs" />
                  <p className="text-xs text-gray-500">
                    {data.position && positionDepartmentMapping[data.position]
                      ? `Department automatically selected based on position`
                      : "Start typing to see suggestions or enter a custom department"}
                  </p>
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
              <p className="text-sm text-gray-600 mt-1">Email, phone number and account security</p>
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
                        value={data.email}
                        className={`pl-10 w-full ${validationErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="e.g. juan.delacruz@cdrrmo.gov.ph"
                      />
                    </div>
                    {validationErrors.email && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span className="break-words">{validationErrors.email}</span>
                      </div>
                    )}
                    <InputError message={errors.email} className="text-xs" />
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
                        value={data.mobile_number}
                        className={`rounded-l-none border-l-0 flex-1 h-10 ${validationErrors.mobile_number ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                        onChange={(e) => handleMobileNumberChange(e.target.value)}
                        placeholder="9123456789"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {validationErrors.mobile_number && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      <span className="break-words">{validationErrors.mobile_number}</span>
                    </div>
                  )}
                  <InputError message={errors.mobile_number} className="text-xs" />
                  <p className="text-xs text-gray-500">Enter 10 digits after +63 (e.g., +639123456789)</p>
                </div>

                {/* Account Security */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-gray-600" />
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Account Password <span className="text-red-500">*</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={data.password}
                        className={`pl-10 w-full ${validationErrors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter a secure password"
                      />
                    </div>
                    {validationErrors.password && (
                      <div className="flex items-center gap-1 text-xs text-red-600">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span className="break-words">{validationErrors.password}</span>
                      </div>
                    )}
                    <InputError message={errors.password} className="text-xs" />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li className={`flex items-center gap-2 ${data.password.length >= 8 ? "text-green-600" : ""}`}>
                        <div
                          className={`w-2 h-2 rounded-full ${data.password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        At least 8 characters
                      </li>
                      <li
                        className={`flex items-center gap-2 ${/(?=.*[a-z])/.test(data.password) ? "text-green-600" : ""}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${/(?=.*[a-z])/.test(data.password) ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        One lowercase letter
                      </li>
                      <li
                        className={`flex items-center gap-2 ${/(?=.*[A-Z])/.test(data.password) ? "text-green-600" : ""}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(data.password) ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        One uppercase letter
                      </li>
                      <li
                        className={`flex items-center gap-2 ${/(?=.*\d)/.test(data.password) ? "text-green-600" : ""}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(data.password) ? "bg-green-500" : "bg-gray-300"}`}
                        ></div>
                        One number
                      </li>
                    </ul>
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
                  type="submit"
                  disabled={processing}
                  className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white flex items-center gap-2 px-6"
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
          </div>
        </form>

        {/* Click outside to close dropdowns */}
        {isPositionOpen || isDepartmentOpen ? (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsPositionOpen(false)
              setIsDepartmentOpen(false)
            }}
          />
        ) : null}
      </div>
    </Authenticated>
  )
}
