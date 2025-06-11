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
import type { FormEventHandler, MouseEventHandler } from "react"
import { useState, useEffect } from "react"
import Select from 'react-select';
import { PageProps, Role } from "@/types"


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

export default function NewPersonnel({ roles }: PageProps<{ roles: Role[] }>) {
  const form = useForm('post', '/personnel/new', {
    first_name: "",
    middle_name: "",
    surname: "",
    name_extension: "",
    email: "",
    mobile_number: "",
    positions: [],
    position: "",
    department: "",
    password: "",
  });

  form.setValidationTimeout(3000);

  const generateRandomPassword: MouseEventHandler = (e) => {
    e.preventDefault();

    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    let newPassword = '';
    let passwordLength = 8;

    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    form.setData('password', newPassword);
  }

  // Position dropdown states
  const [isPositionOpen, setIsPositionOpen] = useState(false)
  const [positionSearch, setPositionSearch] = useState("")

  // Department dropdown states
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false)
  const [departmentSearch, setDepartmentSearch] = useState("")

  // Validation states
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})


  // Filter departments based on selected position
  const getAvailableDepartments = () => {
    if (form.data.position && positionDepartmentMapping[form.data.position]) {
      // If position is selected and has a mapping, only show the mapped department
      return [positionDepartmentMapping[form.data.position]]
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
    form.setData(field as any, value)
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
    form.setData("position", position)
    setPositionSearch(position)
    setIsPositionOpen(false)
    handleFieldValidation("position", position)

    // Auto-set department based on position
    const mappedDepartment = positionDepartmentMapping[position]
    if (mappedDepartment) {
      form.setData("department", mappedDepartment)
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
    form.setData("position", value)
    setIsPositionOpen(true)
    handleFieldValidation("position", value)

    // If user is typing a custom position, clear the department auto-selection
    if (!positionDepartmentMapping[value]) {
      // Only clear if the current department was auto-selected
      const currentDepartment = form.data.department
      if (currentDepartment && Object.values(positionDepartmentMapping).includes(currentDepartment)) {
        form.setData("department", "")
        setDepartmentSearch("")
      }
    }
  }

  const handleDepartmentSelect = (department: string) => {
    form.setData("department", department)
    setDepartmentSearch(department)
    setIsDepartmentOpen(false)
    handleFieldValidation("department", department)
  }

  const handleDepartmentInputChange = (value: string) => {
    setDepartmentSearch(value)
    form.setData("department", value)
    setIsDepartmentOpen(true)
    handleFieldValidation("department", value)
  }

  // Form submission with validation
  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    form.submit({
      onSuccess: () => {
        // addToast("success", "Success!", "Personnel has been created successfully")
        toast('success', 'Success!', 'Personnel has been created successfully');
      },
      onError: (errors) => {
        // addToast("error", "Submission Failed", "There was an error creating the personnel. Please try again.")
        toast('error', 'Submission Failed', 'There was an error creating the personnel. Please try again.');
      },
      onFinish: () => {
        form.reset("password")
      },
    })
  }

  // Initialize validation on mount
  useEffect(() => {
    if (form.data.position) setPositionSearch(form.data.position)
    if (form.data.department) setDepartmentSearch(form.data.department)
  }, [])

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
        <form onSubmit={submit} className="space-y-6">
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
                          value={form.data.surname}
                          className={`w-full ${form.invalid('surname') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => form.setData('surname', e.target.value)}
                          onBlur={() => form.validate('surname')}
                          placeholder="e.g. Dela Cruz"
                        />
                        {form.invalid('surname') && (
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
                          className={`w-full ${form.invalid('first_name') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => form.setData("first_name", e.target.value)}
                          onBlur={() => form.validate('first_name')}
                          placeholder="e.g. Juan"
                        />
                        {form.invalid('first_name') && (
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
                          className={`w-full ${form.invalid('middle_name') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => form.setData("middle_name", e.target.value)}
                          onBlur={() => form.validate('middle_name')}
                          placeholder="e.g. Reyes"
                        />
                        {form.invalid('middle_name') && (
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
                          className={`w-full ${form.invalid('name_extension') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                          onChange={(e) => form.setData("name_extension", e.target.value)}
                          onBlur={() => form.validate('name_extension')}
                          placeholder="e.g. Jr, Sr, III"
                        />
                        {form.invalid('name_extension') && (
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
                  

                  {/* TODO: fucking fix the typescript error here */}
                  <Select 
                    // @ts-ignore
                    options={roles.reduce((arr: {value: number, label: string}[], role, i) => {
                      arr[i] = {
                        value: role.id,
                        label: role.name,
                      }

                      return arr;
                    }, [])}
                    value={form.data.positions}
                    // @ts-ignore
                    onChange={(e) => form.setData('positions', e)}
                    isMulti
                    closeMenuOnSelect={false}
                  />

                  {form.invalid('position') && (
                    <InputError message={form.errors.position} />
                  )}
                  
                </div>

                {/* Department Field */}
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </Label>

                  <Select
                    options={[
                      {value: 1, label: 'Department 1'},
                      {value: 2, label: 'Department 2'},
                      {value: 3, label: 'Department 3'},
                    ]}
                    isMulti
                    closeMenuOnSelect={false}
                  />
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
                        className={`pl-10 w-full ${form.invalid('email') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        onChange={(e) => form.setData("email", e.target.value)}
                        onBlur={() => form.validate('email')}
                        placeholder="e.g. juan.delacruz@cdrrmo.gov.ph"
                      />
                    </div>
                    {form.invalid('email') && (
                      <InputError message={form.errors.email} />
                    )}
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
                        className={`rounded-l-none border-l-0 flex-1 h-10 ${form.invalid('mobile_number') ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                        onChange={(e) => form.setData('mobile_number', e.target.value)}
                        onBlur={() => form.validate('mobile_number')}
                        placeholder="9123456789"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {form.invalid('mobile_number') && (
                    <InputError message={form.errors.mobile_number} />
                  )}
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
                            />
                          </div>
                          <Button onClick={generateRandomPassword}>
                            Generate Random Password
                          </Button>
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
                  type="submit"
                  disabled={form.processing}
                  className="bg-[#1B2560] hover:bg-[#1B2560]/90 text-white flex items-center gap-2 px-6"
                >
                  {form.processing ? (
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
    </div>
  )
}

NewPersonnel.layout = (e:JSX.Element) => <Authenticated children={e} />
