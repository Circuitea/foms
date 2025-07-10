"use client"

import InputError from "@/components/InputError"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import { type FormEventHandler, useMemo } from "react"
import { Check, Lock } from "lucide-react"

interface PasswordRequirement {
  text: string
  met: boolean
}

export default function FirstTimeLogin({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    password: "",
    password_confirmation: "",
  })

  const passwordRequirements: PasswordRequirement[] = useMemo(() => {
    const password = data.password
    return [
      {
        text: "At least 8 characters",
        met: password.length >= 8,
      },
      {
        text: "One lowercase letter",
        met: /[a-z]/.test(password),
      },
      {
        text: "One uppercase letter",
        met: /[A-Z]/.test(password),
      },
      {
        text: "One number",
        met: /\d/.test(password),
      },
    ]
  }, [data.password])

  const allRequirementsMet = passwordRequirements.every((req) => req.met)

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post("/first-time")
  }

  return (
    <GuestLayout>
      <Head title="First Time Login" />

      <div className="mb-4 text-sm">Welcome! Please set up your password to complete your account setup.</div>

      {status && <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">{status}</div>}

      <form onSubmit={submit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              <Lock className="h-4 w-4" />
              Account Password
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full bg-background text-foreground"
              placeholder="Enter a secure password"
              onChange={(e) => setData("password", e.target.value)}
            />
            <InputError message={errors.password} />
          </div>

          {/* Password Requirements */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Requirements</h3>
            <div className="space-y-2">
              {passwordRequirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-4 h-4 rounded-full border-2 ${
                      requirement.met ? "bg-green-500 border-green-500" : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {requirement.met && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span
                    className={`text-sm ${
                      requirement.met ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {requirement.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              className="mt-1 block w-full bg-background text-foreground"
              placeholder="Confirm your new password"
              onChange={(e) => setData("password_confirmation", e.target.value)}
            />
            <InputError message={errors.password_confirmation} />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button variant="secondary" disabled={processing} asChild>
            <Link href={route("logout")} method="post">Cancel</Link>
          </Button>

          <Button
            type="submit"
            className="bg-auth-primary text-auth-primary-foreground"
            disabled={processing || !allRequirementsMet}
          >
            Set Password
          </Button>
        </div>
      </form>
    </GuestLayout>
  )
}
