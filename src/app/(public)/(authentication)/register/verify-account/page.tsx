"use client"
import VerifyAccountForm from '@/components/form/verify-account-form'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
       <VerifyAccountForm/>
      </div>
    </div>
  )
}
