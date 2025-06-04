"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Lock, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from "lucide-react"

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

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-400"
    if (strength <= 3) return "bg-yellow-400"
    return "bg-green-400"
  }

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Medium"
    return "Strong"
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
      setTimeout(() => setRecentlySuccessful(false), 5000)
    } catch (error) {
      setErrors({ general: "Failed to update password. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="max-w-6xl mx-auto mt-8">
      {/* Compact Header */}
      <div className="mb-6 bg-red-50/30 border border-red-100 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <Lock className="w-4 h-4 text-red-600" />
          <div>
            <h1 className="text-lg font-medium text-red-900">Update Password</h1>
            <p className="text-red-700/70 text-sm">
              Ensure your account is using a long, random password to stay secure
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {recentlySuccessful && (
        <Card className="mb-6 border-green-200 bg-green-50/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700 font-medium">Password updated successfully!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compact Two-Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Password Fields */}
        <Card className="h-full border-slate-200/50">
          <CardHeader className="text-center pb-4">
            <h2 className="text-lg font-medium text-gray-700">Password Fields</h2>
            <p className="text-gray-500 text-sm">Enter your current and new passwords</p>
          </CardHeader>
          <CardContent className="flex flex-col justify-center min-h-[400px] px-4">
            <form onSubmit={handleSubmit} className="space-y-5 max-w-xs mx-auto w-full">
              {/* Current Password */}
              <div>
                <Label htmlFor="current_password" className="text-sm font-medium text-gray-600 mb-2 block text-center">
                  Current Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.current_password}
                    onChange={(e) => handleInputChange("current_password", e.target.value)}
                    placeholder="Enter current password"
                    className={`pr-10 h-10 text-center text-sm ${errors.current_password ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-400"}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.current_password && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <p className="text-red-400 text-xs">{errors.current_password}</p>
                  </div>
                )}
              </div>

              {/* New Password */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-600 mb-2 block text-center">
                  New Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter new password"
                    className={`pr-10 h-10 text-center text-sm ${errors.password ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-400"}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${passwordStrength <= 2 ? "text-red-500" : passwordStrength <= 3 ? "text-yellow-500" : "text-green-500"}`}
                      >
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <p className="text-red-400 text-xs">{errors.password}</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <Label
                  htmlFor="password_confirmation"
                  className="text-sm font-medium text-gray-600 mb-2 block text-center"
                >
                  Confirm Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password_confirmation"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                    placeholder="Confirm new password"
                    className={`pr-10 h-10 text-center text-sm ${errors.password_confirmation ? "border-red-400 focus:ring-red-400" : "focus:ring-blue-400"}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <p className="text-red-400 text-xs">{errors.password_confirmation}</p>
                  </div>
                )}
                {formData.password_confirmation && formData.password === formData.password_confirmation && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <p className="text-green-500 text-xs">Passwords match</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 text-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600 h-10 px-8 font-medium text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>

                {errors.general && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <p className="text-red-400 text-xs">{errors.general}</p>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Column - Password Requirements */}
        <Card className="h-full border-slate-200/50">
          <CardHeader className="text-center pb-4">
            <h2 className="text-lg font-medium text-gray-700">Password Requirements</h2>
            <p className="text-gray-500 text-sm">Follow these guidelines for a strong password</p>
          </CardHeader>
          <CardContent className="flex flex-col justify-center min-h-[400px] px-4">
            <div className="max-w-xs mx-auto w-full">
              <div className="bg-blue-50/50 rounded-lg p-5 text-center">
                <div className="p-3 bg-blue-100/50 rounded-full w-fit mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-base font-medium text-blue-700 mb-4">Security Guidelines</h3>
                <ul className="space-y-3 text-sm text-blue-600">
                  <li
                    className={`flex items-center justify-center gap-2 ${formData.password.length >= 8 ? "text-green-600" : ""}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${formData.password.length >= 8 ? "bg-green-400" : "bg-gray-300"}`}
                    />
                    At least 8 characters long
                  </li>
                  <li
                    className={`flex items-center justify-center gap-2 ${/[A-Z]/.test(formData.password) ? "text-green-600" : ""}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-400" : "bg-gray-300"}`}
                    />
                    Contains uppercase letter
                  </li>
                  <li
                    className={`flex items-center justify-center gap-2 ${/[a-z]/.test(formData.password) ? "text-green-600" : ""}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? "bg-green-400" : "bg-gray-300"}`}
                    />
                    Contains lowercase letter
                  </li>
                  <li
                    className={`flex items-center justify-center gap-2 ${/[0-9]/.test(formData.password) ? "text-green-600" : ""}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? "bg-green-400" : "bg-gray-300"}`}
                    />
                    Contains number
                  </li>
                  <li
                    className={`flex items-center justify-center gap-2 ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? "bg-green-400" : "bg-gray-300"}`}
                    />
                    Contains special character
                  </li>
                </ul>
              </div>

              <div className="mt-5 p-4 bg-slate-50 rounded-lg text-center">
                <h4 className="font-medium text-gray-600 mb-2 text-sm">Security Tips</h4>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>Use a unique password for this account</li>
                  <li>Avoid using personal information</li>
                  <li>Consider using a password manager</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
