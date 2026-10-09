"use client"
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { useGetMe, useLogout } from '@/hooks'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
const routes = [
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "About Us", url: "/about-us" },
    { name: "Contact", url: "/contact" },
  { name: "Pricing", url: "/pricing" },
    {name:"Dashboard", url: "/user-dashboard/dashboard"}
]
export default function Header() {
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
       <header className="w-full h-16 border border-b">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
        <div>Constraction</div>
        <nav className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.url} href={route.url}>
              {route.name}
            </Link>
          ))}
        </nav>
        <div>
        </div>
          {!isLoading && !data &&(<Button
            variant="outline"
            render={<Link href="/login">Login</Link>}
            nativeButton={false}
          >
          Login
          </Button>)}
          {!isLoading && data &&(<Button
            variant="destructive"
            onClick={handleLogout}
          >
            Logout
          </Button>)}
      </div>
    </header>
    )
}
