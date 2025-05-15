import { Bell, ClipboardCheck, FolderOpen, LayoutDashboard, LogOut, Phone, Settings, UserPen } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "./ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const navItems = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Notification',
        url: '#',
        icon: Bell,
    },
    {
        title: 'Meetings',
        url: '#',
        icon: Phone,
    },
    {
        title: 'Personnel',
        url: '/personnel',
        icon: UserPen,
    },
    {
        title: 'Inventory',
        url: '#',
        icon: ClipboardCheck,
    },
    {
        title: 'Files',
        url: '#',
        icon: FolderOpen,
    },
]

export function AppSidebar() {
    const user = usePage().props.auth.user;
    const { open } = useSidebar();
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center">
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
                        <SidebarMenu className="space-y-2">
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className="py-5" asChild>
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
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href='/profile'>
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}