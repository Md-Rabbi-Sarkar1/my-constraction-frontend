"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AlertTriangle, BarChart3, Bell, Building2, CheckSquare2, ClipboardList, FileText, FolderKanban, HardHat, LayoutDashboard, LogOut, Menu, Package, Users, X } from "lucide-react";
import { can } from "@/lib/permission";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { RoleBadge } from "@/components/ui/badge";

interface NavItem { href: string; label: string; icon: React.ElementType; permission?: Parameters<typeof can>[0]; }

const NAV_ITEMS: NavItem[] = [
  { href: "/user-dashboard/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/user-dashboard/projects", label: "Projects", icon: FolderKanban, permission: "createProject" },
  { href: "/user-dashboard/tasks", label: "Tasks", icon: CheckSquare2 },
  { href: "/user-dashboard/reports", label: "Daily reports", icon: ClipboardList },
  { href: "/user-dashboard/materials", label: "Materials", icon: Package, permission: "manageMaterial" },
  { href: "/user-dashboard/expenses", label: "Expenses", icon: BarChart3 },
  { href: "/user-dashboard/issues", label: "Issues", icon: AlertTriangle },
  { href: "/user-dashboard/documents", label: "Documents", icon: FileText },
  { href: "/user-dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/user-dashboard/settings/company", label: "Company", icon: Building2, permission: "manageCompany" },
  { href: "/user-dashboard/settings/users", label: "Users", icon: Users, permission: "manageUsers" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, isPending, isError } = useGetMe();
  const { mutate: logout } = useLogout();
  const user = data?.data;

  useEffect(() => { if (!isPending && (!user || isError)) router.push("/login"); }, [user, isPending, isError, router]);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => { toast.add({ title: "Logout", description: "Logged out successfully" }); queryClient.removeQueries({ queryKey: ["user"] }); },
      onError: () => toast.add({ title: "Logout Failed", description: "Something went wrong" }),
    });
  };

  if (isPending) return <div className="flex h-screen w-screen items-center justify-center bg-[#f7f8fa]"><div className="flex items-center gap-3 text-sm font-medium text-slate-500 animate-pulse"><HardHat className="h-5 w-5 text-amber-500" /> Loading workspace...</div></div>;
  if (!user || isError) return null;
  const visibleItems = NAV_ITEMS.filter((item) => !item.permission || can(item.permission, user.role));

  return <div className="min-h-screen bg-[#f7f8fa]">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col transform bg-[#122033] text-slate-100 shadow-2xl shadow-slate-900/10 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6"><Link href="/" className="flex items-center gap-2.5 text-[15px] font-bold tracking-tight text-white"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-[#122033]"><HardHat className="h-5 w-5" /></span>Construction Ops</Link><button className="rounded-lg p-1 text-slate-400 hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button></div>
      <div className="px-5 pb-2 pt-7 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</div>
      <nav className="flex-1 space-y-1 px-3">{visibleItems.map((item) => { const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)); return <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-colors ${active ? "bg-amber-400 font-semibold text-[#122033] shadow-lg shadow-amber-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><item.icon className={`h-[17px] w-[17px] ${active ? "text-[#122033]" : "text-slate-400 group-hover:text-amber-300"}`} />{item.label}</Link>; })}</nav>
      <div className="m-4 rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-semibold text-white">Need a hand?</p><p className="mt-1 text-[11px] leading-relaxed text-slate-400">Keep your projects moving with a clear view of every site operation.</p></div>
    </aside>
    {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden />}
    <div className="lg:pl-[272px]"><header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur lg:px-10"><button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button><div className="ml-auto flex items-center gap-4"><div className="hidden text-right sm:block"><p className="text-[11px] font-medium text-slate-400">Signed in as</p></div><div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">{user.name?.slice(0, 1).toUpperCase()}</div><div className="text-right"><p className="text-sm font-semibold text-slate-900">{user.name}</p><div className="flex justify-end"><RoleBadge role={user.role} /></div></div><button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button></div></header><main className="px-4 py-6 lg:px-10 lg:py-8">{children}</main></div>
  </div>;
}
