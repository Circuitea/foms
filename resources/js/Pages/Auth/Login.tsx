"use client"

import InputError from "@/components/InputError"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GuestLayout from "@/Layouts/GuestLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import type { FormEventHandler } from "react"

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string
  canResetPassword: boolean
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false as boolean,
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()

    post("/login", {
      onFinish: () => reset("password"),
    })
  }

  return (
    <GuestLayout>
      <Head title="Log in" />

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-2">Enter your credentials to access your account</p>
        </div>

        {status && (
          <div className="p-4 rounded-lg bg-green-50 text-sm font-medium text-green-600 border border-green-200">
            {status}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="h-11 bg-white/50 border-input/60 focus-visible:ring-auth-primary"
              autoComplete="email"
              placeholder="name@example.com"
              onChange={(e) => setData("email", e.target.value)}
            />
            <InputError message={errors.email} className="mt-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-base">
                Password
              </Label>
              {canResetPassword && (
                <Link
                  href={route("password.request")}
                  className="text-xs font-medium text-auth-primary hover:text-auth-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="h-11 bg-white/50 border-input/60 focus-visible:ring-auth-primary"
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(e) => setData("password", e.target.value)}
            />
            <InputError message={errors.password} className="mt-1" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              name="remember"
              checked={data.remember}
              className="border-input/60 data-[state=checked]:bg-auth-primary data-[state=checked]:border-auth-primary"
              onCheckedChange={(isChecked) => setData("remember", (isChecked || false) as false)}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>

          <Button
            className="w-full h-11 bg-auth-primary hover:bg-auth-primary/90 text-auth-primary-foreground font-semibold"
            disabled={processing}
          >
            {processing ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </GuestLayout>
  )
}
