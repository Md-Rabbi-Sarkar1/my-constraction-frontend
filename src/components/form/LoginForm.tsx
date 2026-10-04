"use client";

import { useForm } from '@tanstack/react-form'
import { Input } from '../ui/input'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '../ui/field'
import { Button } from '../ui/button'
import { loginSchema } from "@/validation"
import { useState } from 'react'
import { Eye, EyeClosed, ShieldCheck, Briefcase, HardHat, User } from 'lucide-react'
import { useLogin } from '@/hooks'
import { useRouter } from 'next/navigation'
import { toast } from '../ui/toast'
import { Spinner } from '../ui/spinner'
import GoogleLoginComponent from '../modules/google.login/googole.login'
import Link from 'next/link'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const { mutate: login, isPending: loginPending } = useLogin()
    const router = useRouter()

    // 💡 1. Centralized Bypass Configuration Credentials Matrix Map
    const roleBypassConfig = {
        ADMIN: {
            email: "admin@demo.local",
            password: "Password123!",
            label: "Admin Bypass",
            icon: <ShieldCheck className="w-4 h-4 text-rose-600" />,
            style: "hover:bg-rose-50/50 hover:border-rose-300"
        },
        PROJECT_MANAGER: {
            email: "mdrabbisarkar71@gmail.com",
            password: "11111111",
            label: "Manager Bypass",
            icon: <Briefcase className="w-4 h-4 text-blue-600" />,
            style: "hover:bg-blue-50/50 hover:border-blue-300"
        },
        ENGINEER: {
            email: "mdrabbisarkar72@gmail.com",
            password: "11111111",
            label: "Engineer Bypass",
            icon: <HardHat className="w-4 h-4 text-amber-600" />,
            style: "hover:bg-amber-50/50 hover:border-amber-300"
        },
        WORKER: {
            email: "mdrabbisarkar73@gmail.com",
            password: "11111111",
            label: "Worker Bypass",
            icon: <User className="w-4 h-4 text-emerald-600" />,
            style: "hover:bg-emerald-50/50 hover:border-emerald-300"
        }
    };

    // 💡 2. Automated Core Shared Trigger Executing Quick Logins
    const triggerQuickLogin = (roleKey: keyof typeof roleBypassConfig) => {
        const targetCredentials = roleBypassConfig[roleKey];
        
        // Populate the input states for visibility, then dispatch mutation payload
        form.setFieldValue("email", targetCredentials.email);
        form.setFieldValue("password", targetCredentials.password);

        login({
            email: targetCredentials.email,
            password: targetCredentials.password
        }, {
            onSuccess: () => {
                toast.add({
                    title: "Login Success",
                    description: `Logged in quickly as ${roleKey.replace(/_/g, ' ')}`,
                })
                router.push('/user-dashboard/dashboard')
            },
            onError: (err) => {
                toast.add({
                    title: "Login Fail",
                    description: (err as any)?.data?.message || "Bypass request rejected."
                })
            }
        });
    };

    const form = useForm({
        defaultValues: {
            email: "admin@demo.local",
            password: "Password123!"
        },
        validators: {
            onSubmit: loginSchema
        },
        onSubmit: ({ value }) => {
            const loginData = {
                email: value.email,
                password: value.password
            };
            login(loginData, {
                onSuccess: () => {
                    toast.add({
                        title: "Login Success",
                        description: "Welcome",
                    })
                    router.push('/user-dashboard/dashboard')
                },
                onError: (err) => {
                    toast.add({
                        title: "Login Fail",
                        description: (err as any)?.data?.message || "Something wrong, Plz try again"
                    })
                }
            })
        }
    })

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Login to your account
                </h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FieldGroup>
                    <form.Field name="email">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        autoComplete='off'
                                        onBlur={field.handleBlur}
                                        value={field.state.value}
                                        aria-invalid={isInvalid}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    </form.Field>

                    <form.Field name="password">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <div className='relative'>
                                        <Input
                                            id={field.name}
                                            type={showPassword ? "text" : "password"}
                                            name={field.name}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            autoComplete='off'
                                            onBlur={field.handleBlur}
                                            value={field.state.value}
                                            aria-invalid={isInvalid}
                                        />
                                        <button className='absolute right-3 top-1' type="button" onClick={() => setShowPassword((pre) => !pre)}>
                                            {showPassword ? <Eye /> : <EyeClosed />}
                                        </button>
                                    </div>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    </form.Field>
                    
                    <Button disabled={loginPending} type='submit'>
                        {loginPending ? <><Spinner />Submitting</> : <>Submit</>}
                    </Button>
                </FieldGroup>
            </form>

            <FieldSeparator>Or</FieldSeparator>
            
            <GoogleLoginComponent />

            {/* 💡 3. ONE-CLICK MULTI-ROLE QUICK ACCESS OVERLAY MODULE */}
            <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                    Quick Developer Access Profile Login
                </span>
                <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(roleBypassConfig) as Array<keyof typeof roleBypassConfig>).map((roleKey) => {
                        const target = roleBypassConfig[roleKey];
                        return (
                            <button
                                key={roleKey}
                                type="button"
                                disabled={loginPending}
                                onClick={() => triggerQuickLogin(roleKey)}
                                className={`flex items-center gap-2 border rounded-lg px-3 py-2 bg-white text-left font-medium text-xs transition shadow-sm disabled:opacity-50 text-slate-800 border-slate-200/80 ${target.style}`}
                            >
                                {target.icon}
                                <div className="truncate">
                                    <p className="font-bold leading-none">{target.label}</p>
                                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{target.email}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-1">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium underline underline-offset-4 hover:text-primary"
                >
                  Register
                </Link>
            </div>
        </div>
    )
}
