"use client"

import { Bell, CheckCheck, ClipboardCheck, LayoutDashboard, LogOut, LucideIcon, Map, Phone, Settings, UserPen } from "lucide-react"
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
} from "./ui/sidebar"
import { Link, router, usePage } from "@inertiajs/react"
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { useState } from "react"
import { userHasPermission } from "@/lib/utils"
import { StatusSelector } from "./status-selector"

interface NavItem {
  title: string,
  url: string,
  icon: LucideIcon,
  permissions?: RegExp,
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title:"Map",
    url: "/map",
    icon: Map,
    permissions: /map\.(?:read|\*)/,
  },
  {
    title: "My Tasks",
    url: "/my-tasks",
    icon: Bell,
  },
  {
    title: "Field Tasks",
    url: "/tasks",
    icon: CheckCheck,
    permissions: /tasks\.(?:read|\*)/,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Phone,
    permissions: /meetings\.(?:read|\*)/,
  },
  {
    title: "Personnel",
    url: "/personnel",
    icon: UserPen,
    permissions: /personnel\.(?:read|\*)/,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: ClipboardCheck,
    permissions: /inventory\.(?:read|\*)/,
  },
]

export function AppSidebar() {
  const user = usePage().props.auth.user
  const profilePicturePath = usePage().props.auth.profilePicture;

  const [ isLogoutDialogOpen, setIsLogoutDialogOpen ] = useState(false);
  
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between">
              <SidebarTrigger className="ml-auto" />
            </div>
            <div className="flex flex-col items-center space-y-2 py-4 group-data-[collapsible=icon]:hidden">
              <div className="w-28 h-28 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  {profilePicturePath ? (
                    <img src={profilePicturePath} className="w-20 h-20 rounded-full" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24"> 
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-medium text-lg">{user.first_name} {user.surname.charAt(0).toUpperCase()}.</p>
                <p className="text-white/70 text-sm">{user.position ?? 'CDRRMO Personnel'}</p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <StatusSelector />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="h-full flex flex-col justify-center">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {navItems.map((item) => {
                const menuItemContent = (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="py-3 px-4 rounded-lg hover:shadow-xs transition-all duration-200"
                      tooltip={item.title}
                      asChild
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )

                if (!item.permissions) return menuItemContent;

                if (item.permissions && userHasPermission(item.permissions)) {
                  return menuItemContent;
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="py-3 px-4 rounded-lg hover:shadow-xs transition-all duration-200"
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
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  className="py-3 px-4 rounded-lg hover:shadow-xs transition-all duration-200"
                  tooltip="Logout"
                >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                Are you sure you want to logout?
                <DialogFooter>
                  <Button onClick={() => setIsLogoutDialogOpen(false)}>Cancel</Button>
                  <Button variant='destructive' onClick={() => router.post(route('logout'))}>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
