"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import type { PageProps } from "@/types"
import { Head } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import UpdatePasswordForm from "./Partials/UpdatePasswordForm"
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm"
import ListPersonalAccessTokens from "./Partials/ListPersonalAccessTokens"

export default function Edit({ mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  const [currentTime, setCurrentTime] = useState("")

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
      setCurrentTime(now.toLocaleDateString("en-US", options))
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <Head title="Profile" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#1B2560] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-white" />
              <h1 className="text-xl font-semibold text-white">Settings</h1>
            </div>
            <div className="text-sm font-mono text-white">{currentTime}</div>
          </div>
          <div className="mt-2">
            <nav className="text-sm text-gray-300">
              <span>CDRRMO Staff Portal</span>
              <span className="mx-2">{">"}</span>
              <span>Settings</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
            <UpdateProfileInformationForm />
          </div>

          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
            <UpdatePasswordForm />
          </div>

          <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
            <ListPersonalAccessTokens />
          </div>
        </div>
      </div>
    </div>
  )
}

Edit.layout = (e: JSX.Element) => <AuthenticatedLayout pageTitle="Profile Settings" children={e} />
