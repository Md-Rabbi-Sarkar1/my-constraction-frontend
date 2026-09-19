"use client"
import { useForm } from '@tanstack/react-form'
import { Input } from '../ui/input'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '../ui/field'
import { Button } from '../ui/button'
import { loginSchema } from "@/validation"
import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { useGoogleOAuth, useLogin } from '@/hooks'
import { email } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from '../ui/toast'
import { Spinner } from '../ui/spinner'
import { GoogleLogin } from '@react-oauth/google'
import GoogleLoginComponent from '../modules/google.login/googole.login'
import Link from 'next/link'
export default function LoginForm() {

    const [showPassword, setShowPassword] = useState(false)

    const { mutate: login, isPending: loginPending } = useLogin()
    
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            email: "mdrabbisarkar70@gmail.com",
            password: "SecurePassword123!"
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
                onSuccess: (res) => {
                    toast.add({
                        title: "Login Success",
                        description: "Welcome",
                    })
                    router.push('/')
                },
                onError: (err) => {
                    toast.add({
                        title: "Login Fail",
                        description: err.message || "Something wrong , Plz try again"
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
                        {
                            (field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}> Email</FieldLabel>
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

                            }
                        }

                    </form.Field>
                    <form.Field name="password">
                        {
                            (field) => {
                                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}> Passwrod</FieldLabel>
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

                            }
                        }

                    </form.Field>
                    <Button disabled={loginPending} type='submit'>{loginPending ? <><Spinner />Submitting</> : <>Submit</>}</Button>
                </FieldGroup>

            </form>
            <FieldSeparator>Or</FieldSeparator>
            <GoogleLoginComponent></GoogleLoginComponent>
            <div className="text-center text-sm text-muted-foreground">
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
