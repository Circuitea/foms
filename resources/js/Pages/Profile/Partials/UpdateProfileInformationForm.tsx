"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { User, Upload, Camera, X, Save, CheckCircle, AlertCircle } from "lucide-react"

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
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [recentlySaved, setRecentlySaved] = useState(false)
  const [saveError, setSaveError] = useState("")

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

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setRecentlySaved(true)
      setTimeout(() => setRecentlySaved(false), 3000)
    } catch (error) {
      setSaveError("Failed to save profile information. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Compact Header */}
      <div className="mb-6 bg-blue-50/30 border border-blue-100 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-blue-600" />
          <div>
            <h1 className="text-lg font-medium text-blue-900">Personal Information</h1>
            <p className="text-blue-700/70 text-sm">Employee photo and basic personal details</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {recentlySaved && (
        <Card className="mb-6 border-green-200 bg-green-50/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700 font-medium">Profile information saved successfully!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {saveError && (
        <Card className="mb-6 border-red-200 bg-red-50/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-medium">{saveError}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact Two-Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Employee Photo */}
        <Card className="h-full border-slate-200/50">
          <CardHeader className="text-center pb-4">
            <h2 className="text-lg font-medium text-gray-700">Employee Photo</h2>
            <p className="text-gray-500 text-sm">Upload your profile picture</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] px-4">
            {/* Photo Upload Area - Smaller and Centered */}
            <div className="w-48 h-48 mb-6">
              {selectedImage ? (
                <div className="relative w-full h-full group">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Profile photo"
                    className="w-full h-full object-cover rounded-full shadow-md border-2 border-slate-100"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-full flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-gray-600 rounded-full text-xs"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                      >
                        <Camera className="w-3 h-3 mr-1" />
                        Change
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-400/90 hover:bg-red-500 rounded-full"
                        onClick={removeImage}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-full border-2 border-dashed border-slate-300 rounded-full flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  <div className="p-4 bg-blue-50 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-blue-500 font-medium">Upload Photo</p>
                  <p className="text-gray-400 text-sm">Click to browse</p>
                </div>
              )}
            </div>

            {/* File Input */}
            <Input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              className="hidden"
              id="photo-upload"
              disabled={isUploading}
            />

            {/* Upload Button */}
            <Button
              variant="outline"
              className="w-40 mb-4 border-blue-200 text-blue-500 hover:bg-blue-50 text-sm"
              onClick={() => document.getElementById("photo-upload")?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Choose File"}
            </Button>

            {/* Requirements Box - Smaller */}
            <div className="bg-slate-50 rounded-lg p-4 w-full max-w-xs text-center">
              <p className="text-xs font-medium text-gray-600 mb-2">Photo Requirements</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>JPG or PNG format</p>
                <p>Maximum 2MB file size</p>
                <p>400x400px recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Full Name */}
        <Card className="h-full border-slate-200/50">
          <CardHeader className="text-center pb-4">
            <h2 className="text-lg font-medium text-gray-700">Full Name</h2>
            <p className="text-gray-500 text-sm">Your official name details</p>
          </CardHeader>
          <CardContent className="flex flex-col justify-center min-h-[400px] px-4">
            <div className="space-y-5 max-w-xs mx-auto w-full">
              {/* Surname */}
              <div>
                <Label htmlFor="surname" className="text-sm font-medium text-gray-600 mb-2 block text-center">
                  Surname <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="surname"
                  value={user.surname}
                  placeholder="e.g. Dela Cruz"
                  readOnly
                  className="bg-slate-50 border-slate-200 text-gray-600 cursor-not-allowed h-10 text-center text-sm"
                />
              </div>

              {/* First Name */}
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-600 mb-2 block text-center">
                  First Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={user.firstName}
                  placeholder="e.g. Juan"
                  readOnly
                  className="bg-slate-50 border-slate-200 text-gray-600 cursor-not-allowed h-10 text-center text-sm"
                />
              </div>

              {/* Middle Name */}
              <div>
                <Label htmlFor="middleName" className="text-sm font-medium text-gray-600 mb-2 block text-center">
                  Middle Name
                </Label>
                <Input
                  id="middleName"
                  value={user.middleName}
                  placeholder="e.g. Reyes"
                  readOnly
                  className="bg-slate-50 border-slate-200 text-gray-600 cursor-not-allowed h-10 text-center text-sm"
                />
              </div>

              {/* Extension */}
              <div>
                <Label htmlFor="extension" className="text-sm font-medium text-gray-600 mb-2 block text-center">
                  Extension
                </Label>
                <Input
                  id="extension"
                  value={user.extension}
                  placeholder="e.g. Jr, Sr, III"
                  readOnly
                  className="bg-slate-50 border-slate-200 text-gray-600 cursor-not-allowed h-10 text-center text-sm"
                />
              </div>
            </div>

            {/* Info Note - Smaller */}
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-xs mx-auto text-center">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> Name fields are managed by HR. Contact your administrator for changes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button Section */}
      <div className="mt-6 text-center">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-500 hover:bg-blue-600 h-10 px-8 font-medium text-sm"
        >
          {isSaving ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile Information
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
