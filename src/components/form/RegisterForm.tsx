"use client"


import React from 'react';
import { useForm } from '@tanstack/react-form';
// import { RegisterFormValues, registerSchema } from '@/validation';
import { Separator } from '../ui/separator';
import GoogleLoginComponent from '../modules/google.login/googole.login';
import { FieldGroup, FieldSeparator } from '../ui/field';
import { useRegistration } from '@/hooks';
import { toast } from '../ui/toast';
import { useRouter } from 'next/navigation';
import { registerPayloadSchema, TRegisterPayload } from '@/validation';


// 1. Define the Zod Schema based on your object structure


export default function  RegisterForm() {
const router = useRouter();
    const defaultValues: TRegisterPayload = {
        companyName: '',
        slug: '',
        user: {
            name: '',
            email: '',
            password: '',
            role: 'ADMIN' as const, // Hardcoded as ADMIN per requirements
        },
    }
    const { mutate: registration } = useRegistration()
    // 2. Initialize TanStack Form
    const form = useForm({
        defaultValues,
        validators: {
            onSubmit: registerPayloadSchema
        },

        onSubmit: async ({ value }) => {
            console.log(value)
            // Do something with form values
            const registrationData :TRegisterPayload = {
                companyName: value.companyName,
                slug: value.slug,
                user: {
                    name: value.user.name,
                    email: value.user.email,
                    password: value.user.password,
                    role: value.user.role
                }
            };
            registration(registrationData, {
                onSuccess: (res) => {
                    if (!res.success) {
                        toast.add({
                            title: "Server Failure",
                            description: "Something went wrong. Please try again",
                            type: "error",
                        });
                    }

                    toast.add({
                        title: "Registration opt Sent",
                        description: "Please verify your account",
                        type: "success",
                    });
                    const params = new URLSearchParams({ email: registrationData.user.email });
                    router.push(`/register/verify-account?${params.toString()}`);
                },
                onError: (err) => {
                    toast.add({
                        title: "Authorization failure",
                        description:
                            err.message || "Something went wrong. Please try again",
                        type: "error",
                    });
                },
            })
        },

    });

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-md shadow"
            >
                <FieldGroup>
                    <h2 className="text-xl font-bold mb-4">Register Admin Account</h2>

                    {/* Company Name Field */}
                    <form.Field
                        name="companyName"
                        // validators={{ onChange: registerSchema.shape.companyName }}
                        children={(field) => (
                            <div>
                                <label className="block text-sm font-medium">Company Name</label>
                                <input
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                />
                                {field.state.meta.errors ? (
                                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
                                ) : null}
                            </div>
                        )}
                    />

                    {/* Slug Field */}
                    <form.Field
                        name="slug"
                        // validators={{ onChange: registerSchema.shape.slug }}
                        children={(field) => (
                            <div>
                                <label className="block text-sm font-medium">Slug</label>
                                <input
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                />
                                {field.state.meta.errors ? (
                                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
                                ) : null}
                            </div>
                        )}
                    />

                    {/* User Name Field */}
                    <form.Field
                        name="user.name"
                        // validators={{ onChange: registerSchema.shape.user.shape.name }}
                        children={(field) => (
                            <div>
                                <label className="block text-sm font-medium">Admin Name</label>
                                <input
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                />
                                {field.state.meta.errors ? (
                                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
                                ) : null}
                            </div>
                        )}
                    />

                    {/* User Email Field */}
                    <form.Field
                        name="user.email"
                        // validators={{ onChange: registerSchema.shape.user.shape.email }}
                        children={(field) => (
                            <div>
                                <label className="block text-sm font-medium">Email Address</label>
                                <input
                                    type="email"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                />
                                {field.state.meta.errors ? (
                                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
                                ) : null}
                            </div>
                        )}
                    />

                    {/* User Password Field */}
                    <form.Field
                        name="user.password"
                        // validators={{ onChange: registerSchema.shape.user.shape.password }}
                        children={(field) => (
                            <div>
                                <label className="block text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                                />
                                {field.state.meta.errors ? (
                                    <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
                                ) : null}
                            </div>
                        )}
                    />

                    {/* Submit Button */}
                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                        children={([canSubmit, isSubmitting]) => (
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 mt-4"
                            >
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                        )}
                    />
                </FieldGroup>
            </form>
            <FieldGroup>
                <FieldSeparator>Or</FieldSeparator>
                <GoogleLoginComponent></GoogleLoginComponent></FieldGroup>
        </div>
    );
}
