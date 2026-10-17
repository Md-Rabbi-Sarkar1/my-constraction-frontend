"use client"
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useGetMe, useLogout } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
import { HardHat, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
const routes = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "About Us", url: "/about-us" },
    { name: "Contact", url: "/contact" },
  { name: "Pricing", url: "/pricing" },
    {name:"Dashboard", url: "/user-dashboard/dashboard"}
]
export default function Header() {
    const [mobileOpen, setMobileOpen] = React.useState(false)
    const {data, isLoading} = useGetMe()
    const {mutate:logout} = useLogout()
    const queryClient = useQueryClient()
    const handleLogout =() =>{
        logout(undefined,{
            onSuccess:()=>{
                toast.add({
                    title:"Logout",
                    description:"Logout succefylly",
                });
                queryClient.removeQueries({queryKey:["user"]})
            },
            onError:()=>{
                toast.add({
                    title:"Logout Failded",
                    description:"Something wrong",
                })
            }
        })
    }

    return (
       <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#101b2c]/95">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight text-slate-900 dark:text-white"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-900"><HardHat className="h-5 w-5" /></span>Construction Ops</Link>
        <nav className="hidden items-center gap-7 md:flex">
          {routes.map((route) => (
            <Link className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white" key={route.url} href={route.url}>
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {!isLoading && !data &&(<Button
            variant="outline"
            className="dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            render={<Link href="/login">Login</Link>}
            nativeButton={false}
          >
          Login
          </Button>)}
          {!isLoading && data &&(<Button
            className="bg-amber-400 text-slate-950 hover:bg-amber-500"
            onClick={handleLogout}
          >
            Logout
          </Button>)}
      </div>
      </div>
      <div className="absolute right-16 top-5 md:hidden"><ThemeToggle /></div><button className="absolute right-5 top-5 rounded-lg p-2 text-slate-700 dark:text-slate-300 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      {mobileOpen && <div className="border-t border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-[#101b2c] md:hidden"><nav className="flex flex-col gap-3">{routes.map((route) => <Link key={route.url} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10" href={route.url}>{route.name}</Link>)}</nav></div>}
    </header>
    )
}
