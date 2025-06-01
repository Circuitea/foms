"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"

export default function UpdatePasswordForm() {
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [recentlySuccessful, setRecentlySuccessful] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.current_password) {
      newErrors.current_password = "Current password is required"
    }

    if (!formData.password) {
      newErrors.password = "New password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation is required"
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setFormData({
        current_password: "",
        password: "",
        password_confirmation: "",
      })

      setRecentlySuccessful(true)
      setTimeout(() => setRecentlySuccessful(false), 3000)
    } catch (error) {
      setErrors({ general: "Failed to update password. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8">
      {/* Header - matching the Personal Information header style */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Update Password</h1>
        </div>
        <p className="text-gray-600">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      {/* Form - single column layout to match the spacing */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <Label htmlFor="current_password" className="text-sm font-medium text-gray-700 mb-2 block">
            Current Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative max-w-md">
            <Input
              id="current_password"
              type={showPasswords.current ? "text" : "password"}
              value={formData.current_password}
              onChange={(e) => handleInputChange("current_password", e.target.value)}
              placeholder="Enter your current password"
              className={`pr-10 ${errors.current_password ? "border-red-500" : ""}`}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.current_password && <p className="text-red-500 text-sm mt-1">{errors.current_password}</p>}
        </div>

        {/* New Password */}
        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
            New Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative max-w-md">
            <Input
              id="password"
              type={showPasswords.new ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Enter your new password"
              className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <p className="text-blue-600 text-sm mt-1">Password must be at least 8 characters long</p>
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 mb-2 block">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative max-w-md">
            <Input
              id="password_confirmation"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.password_confirmation}
              onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
              placeholder="Confirm your new password"
              className={`pr-10 ${errors.password_confirmation ? "border-red-500" : ""}`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
        </div>

        {/* Submit Button and Success Message */}
        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Saving..." : "Save"}
          </Button>

          {recentlySuccessful && <p className="text-green-600 text-sm">Password updated successfully!</p>}

          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
        </div>
      </form>
    </div>
  )
}
