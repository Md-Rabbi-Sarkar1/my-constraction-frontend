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
            label: "Admin",
            icon: <ShieldCheck className="w-4 h-4 text-rose-600" />,
            style: "hover:bg-rose-50/50 hover:border-rose-300 border-rose-100"
        },
        PROJECT_MANAGER: {
            email: "mdkhias70@gmail.com",
            password: "Khias123#",
            label: "Manager",
            icon: <Briefcase className="w-4 h-4 text-blue-600" />,
            style: "hover:bg-blue-50/50 hover:border-blue-300 border-blue-100"
        },
        ENGINEER: {
            email: "mdrabbisarkar70@gmail.com",
            password: "Raja123#",
            label: "Engineer",
            icon: <HardHat className="w-4 h-4 text-amber-600" />,
            style: "hover:bg-amber-50/50 hover:border-amber-300 border-amber-100"
        },
        WORKER: {
            email: "mdrabbisarkar72@gmail.com",
            password: "Rabbi123#",
            label: "Worker",
            icon: <User className="w-4 h-4 text-emerald-600" />,
            style: "hover:bg-emerald-50/50 hover:border-emerald-300 border-emerald-100"
        }
    };

    const form = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        validators: {
            onSubmit: loginSchema
        },
        onSubmit: ({ value }) => {
            const loginData = {
                email: value.email,
                password: value.password
            };
            executeLogin(loginData, "Email Login");
        }
    })

    // 💡 রিইউজেবল এবং ক্লিন লগইন এক্সিকিউটর ফাংশন
    const executeLogin = (credentials: typeof form.state.values, roleLabel: string) => {
        login(credentials, {
            onSuccess: () => {
                toast.add({
                    title: "Login Success",
                    description: `Welcome! Logged in as ${roleLabel}`,
                })
                router.push('/user-dashboard/dashboard')
            },
            onError: (err) => {
                toast.add({
                    title: "Login Fail",
                    description: (err as any)?.data?.message || "Something went wrong, please try again."
                })
            }
        });
    };

    // 💡 2. Automated Core Shared Trigger Executing Quick Logins
      // 💡 2. Automated Core Shared Trigger Executing Quick Logins
    const triggerQuickLogin = (roleKey: keyof typeof roleBypassConfig) => {
        const targetCredentials = roleBypassConfig[roleKey];
        
        // ১. ফর্মের ফিল্ডগুলোতে ভ্যালু সেট করা
        form.setFieldValue("email", targetCredentials.email);
        form.setFieldValue("password", targetCredentials.password);

        // ২. ফিল্ডগুলোর মেটা স্টেট আপডেট করে 'isTouched' ট্রু (true) করা
        form.setFieldMeta("email", (prev) => ({ ...prev, isTouched: true }));
        form.setFieldMeta("password", (prev) => ({ ...prev, isTouched: true }));

        // ৩. সরাসরি রিকোয়েস্ট ফায়ার করা
        executeLogin({
            email: targetCredentials.email,
            password: targetCredentials.password
        }, targetCredentials.label);
    };


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
                                        <button className='absolute right-3 top-2' type="button" onClick={() => setShowPassword((pre) => !pre)}>
                                            {showPassword ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            )
                        }}
                    </form.Field>
                    
                    <Button disabled={loginPending} type='submit' className="w-full">
                        {loginPending ? <><Spinner />Submitting</> : <>Submit</>}
                    </Button>
                </FieldGroup>
            </form>

            <FieldSeparator>Or</FieldSeparator>
            
            <GoogleLoginComponent />

            {/* 💡 3. ONE-CLICK MULTI-ROLE QUICK ACCESS OVERLAY MODULE */}
            <div className="space-y-3 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
                    Quick Dev Bypass Access
                </span>
                <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(roleBypassConfig) as Array<keyof typeof roleBypassConfig>).map((roleKey) => {
                        const config = roleBypassConfig[roleKey];
                        return (
                            <button
                                key={roleKey}
                                type="button"
                                disabled={loginPending}
                                onClick={() => triggerQuickLogin(roleKey)}
                                className={`flex items-center gap-2 p-2.5 text-xs font-medium border rounded-md transition-all duration-200 bg-card text-foreground disabled:opacity-50 disabled:pointer-events-none ${config.style}`}
                            >
                                {config.icon}
                                <span className="truncate">{config.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
