"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSignature, FileText, Flag, LayoutDashboard, MessagesSquare, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Logo, LogoMark } from "@/components/logo";
import { NeonUserButton } from "@/components/neon-user-button";

const NAV = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Tools",
    items: [
      { title: "Resume", href: "/resume", icon: FileText },
      { title: "Cover letters", href: "/ai-cover-letter", icon: FileSignature },
      { title: "Interview practice", href: "/interview", icon: MessagesSquare },
      { title: "Goals", href: "/goals", icon: Flag },
    ],
  },
];

const ACCOUNT = { title: "Account", href: "/account/settings", match: "/account", icon: Settings };

const ALL = [...NAV.flatMap((g) => g.items), ACCOUNT];

const isActive = (pathname, item) => {
  const base = item.match || item.href;
  return pathname === base || pathname.startsWith(`${base}/`);
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b border-sidebar-border px-3">
        <div className="group-data-[collapsible=icon]:hidden">
          <Logo href="/dashboard" size={26} />
        </div>
        <Link
          href="/dashboard"
          aria-label="LaunchTrack dashboard"
          className="hidden justify-center group-data-[collapsible=icon]:flex"
        >
          <LogoMark size={24} />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(pathname, item)} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon aria-hidden="true" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(pathname, ACCOUNT)} tooltip={ACCOUNT.title}>
              <Link href={ACCOUNT.href}>
                <ACCOUNT.icon aria-hidden="true" />
                <span>{ACCOUNT.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex items-center gap-2 px-1 py-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <NeonUserButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// Slim bar at the top of every app screen: sidebar toggle and where you are.
export function AppTopBar() {
  const pathname = usePathname();
  const current = ALL.find((item) => isActive(pathname, item));

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 !h-4" />
      <span className="text-sm font-medium">{current?.title || "LaunchTrack"}</span>
    </header>
  );
}
