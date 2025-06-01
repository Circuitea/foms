"use client"

import { Bell, CheckCheck, ClipboardCheck, LayoutDashboard, LogOut, Phone, Settings, PenIcon as UserPen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar"
import { Link, router, usePage } from "@inertiajs/react"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Notification",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckCheck,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Phone,
  },
  {
    title: "Personnel",
    url: "/personnel",
    icon: UserPen,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: ClipboardCheck,
  },
]

export function AppSidebar() {
  const user = usePage().props.auth.user
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between">
              <SidebarTrigger className="ml-auto" />
            </div>
            <div className="flex flex-col items-center space-y-2 py-4 group-data-[collapsible=icon]:hidden">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24"> 
                       <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-medium text-lg">Yuan</p>
                <p className="text-white/70 text-sm">Admin</p>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="h-full flex flex-col justify-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="py-3 px-4 rounded-lg hover:shadow-sm transition-all duration-200"
                    tooltip={item.title}
                    asChild
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="py-3 px-4 rounded-lg hover:shadow-sm transition-all duration-200"
              tooltip="Settings"
              asChild
            >
              <Link href="/profile">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="py-3 px-4 rounded-lg hover:shadow-sm transition-all duration-200"
              tooltip="Logout"
              onClick={() => router.post(route("logout"))}
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
