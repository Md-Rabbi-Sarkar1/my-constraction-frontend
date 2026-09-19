import Footer from '@/components/layout/public/Footer'
import Header from '@/components/layout/public/Header'
import React from 'react'

export default function Layout({children}:{children:React.ReactNode}) {
  return (
    <div className='flex flex-col min-h-screen'>
        <Header></Header>
        <main className='flex-1'>{children}</main>
        <Footer></Footer>
    </div>
  )
}
