"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Upload } from "lucide-react"

interface PersonalInformationProps {
  user?: {
    surname?: string
    firstName?: string
    middleName?: string
    extension?: string
    photo?: string
  }
}

export default function PersonalInformation({
  user = {
    surname: "Dela Cruz",
    firstName: "Juan",
    middleName: "Reyes",
    extension: "Jr",
  },
}: PersonalInformationProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(user.photo || null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        alert("Please select a JPG or PNG image")
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("Image size must be less than 2MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Personal Information</h1>
        </div>
        <p className="text-gray-600">Employee photo and basic personal details</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Employee Photo Section */}
        <div>
          <Label className="text-base font-medium text-gray-900 mb-4 block">Employee Photo</Label>

          <div className="space-y-4">
            {/* Photo Upload Area */}
            <div className="relative">
              <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                {selectedImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Profile photo"
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-blue-600 font-medium">Upload Photo</p>
                    <p className="text-gray-500 text-sm">Click to browse</p>
                  </div>
                )}
              </div>
            </div>

            {/* File Input */}
            <div>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <Label htmlFor="photo-upload">
                <Button variant="outline" className="w-full cursor-pointer" asChild>
                  <span>Choose File</span>
                </Button>
              </Label>
            </div>

            {/* File Requirements */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>JPG, PNG up to 2MB</p>
              <p>Recommended: 400x400px</p>
            </div>
          </div>
        </div>

        {/* Full Name Section */}
        <div>
          <Label className="text-base font-medium text-gray-900 mb-6 block">Full Name</Label>

          <div className="space-y-6">
            {/* Surname */}
            <div>
              <Label htmlFor="surname" className="text-sm font-medium text-gray-700 mb-2 block">
                Surname <span className="text-red-500">*</span>
              </Label>
              <Input
                id="surname"
                value={user.surname}
                placeholder="e.g. Dela Cruz"
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* First Name */}
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={user.firstName}
                placeholder="e.g. Juan"
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Middle Name */}
            <div>
              <Label htmlFor="middleName" className="text-sm font-medium text-gray-700 mb-2 block">
                Middle Name
              </Label>
              <Input
                id="middleName"
                value={user.middleName}
                placeholder="e.g. Reyes"
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Extension */}
            <div>
              <Label htmlFor="extension" className="text-sm font-medium text-gray-700 mb-2 block">
                Extension
              </Label>
              <Input
                id="extension"
                value={user.extension}
                placeholder="e.g. Jr, Sr, III"
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
