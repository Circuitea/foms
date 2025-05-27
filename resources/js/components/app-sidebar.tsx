"use client"

import {
  Bell,
  ClipboardCheck,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Phone,
  Settings,
  PenIcon as UserPen,
} from "lucide-react"
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
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Notification',
        url: '/notifications',
        icon: Bell,
    },
    {
        title: 'Meetings',
        url: '/meetings',
        icon: Phone,
    },
    {
        title: 'Personnel',
        url: '/personnel',
        icon: UserPen,
    },
    {
        title: 'Inventory',
        url: '/inventory',
        icon: ClipboardCheck,
    },
]

export function AppSidebar() {
  const user = usePage().props.auth.user
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between">
              <SidebarTrigger className="ml-auto" />
            </div>
            {/* <div className="flex">
                            <Avatar className="">
                                <AvatarFallback className="text-foreground">{`${user.first_name.slice(0, 1)}${user.surname.slice(0,1)}`}</AvatarFallback>
                            </Avatar>
                            <div className="pl-2">
                                <p>{`${user.first_name} ${user.surname}`}</p>
                                <p className="text-xs">[POSITION]</p>
                            </div>
                        </div> */}
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
