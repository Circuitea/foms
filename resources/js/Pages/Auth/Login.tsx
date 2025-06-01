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
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
          <p className="text-sm text-white/70 mt-2">Enter your credentials to access your account</p>
        </div>

        {status && (
          <div className="p-4 rounded-lg bg-green-50 text-sm font-medium text-green-600 border border-green-200">
            {status}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/50"
              autoComplete="email"
              placeholder="name@example.com"
              onChange={(e) => setData("email", e.target.value)}
            />
            <InputError message={errors.email} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-base text-white">
                Password
              </Label>
              {canResetPassword && (
                <Link
                  href={route("password.request")}
                  className="text-xs font-medium text-white/80 hover:text-white transition-colors"
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
              className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/50"
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(e) => setData("password", e.target.value)}
            />
            <InputError message={errors.password} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              name="remember"
              checked={data.remember}
              className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:border-white"
              onCheckedChange={(isChecked) => setData("remember", (isChecked || false) as false)}
            />
            <Label htmlFor="remember" className="text-sm font-normal text-white">
              Remember me
            </Label>
          </div>

          <Button
            className="w-full h-11 bg-[#FF8484] hover:bg-[#e57676] text-white font-semibold mt-6"
            disabled={processing}
          >
            {processing ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </GuestLayout>
  )
}
