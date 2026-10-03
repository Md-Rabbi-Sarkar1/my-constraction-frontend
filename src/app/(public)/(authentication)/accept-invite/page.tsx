"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVerifyInvite } from "@/hooks";
import { AcceptInviteFormValues, acceptInviteSchema } from "@/validation/user.validation";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const tokenFromUrl = searchParams.get("token") || "";
  const { mutateAsync: verifyInvite, isPending } = useVerifyInvite();

  const form = useForm({
    defaultValues: {
      token: tokenFromUrl,
      name: "",
      password: "",
    } as AcceptInviteFormValues,
    onSubmit: async ({ value }) => {
      setFieldErrors({});

      // Execute Zod safe validation on submit execution
      const result = acceptInviteSchema.safeParse(value);

      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path) {
            errors[issue.path.toString()] = issue.message;
          }
        });
        setFieldErrors(errors);
        return;
      }

      try {
        await verifyInvite(result.data);
        alert("Account setup completed successfully!");
        router.push("/login");
      } catch (err) {
        alert("Failed to complete account setup.");
      }
    },
  });

  // Keep the token field value inside the form in sync if the URL populates later
  useEffect(() => {
    if (tokenFromUrl) {
      form.setFieldValue("token", tokenFromUrl);
    }
  }, [tokenFromUrl, form]);

  if (!tokenFromUrl) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 text-center text-red-600 font-medium border border-red-100 bg-red-50 rounded-lg">
        Invalid or missing invitation token link.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-sm bg-white space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-slate-900">Complete Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill out your account details to join the team.</p>
      </div>

      <fieldset disabled={isPending} className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Token Field (Read Only) */}
          <form.Field name="token">
            {(field) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Invitation Token</label>
                <Input
                  readOnly
                  className="bg-slate-50 text-muted-foreground cursor-not-allowed"
                  value={field.state.value}
                />
                {fieldErrors.token && <p className="text-red-500 text-xs mt-1">{fieldErrors.token}</p>}
              </div>
            )}
          </form.Field>

          {/* Name Field */}
          <form.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Your Full Name</label>
                <Input
                  required
                  placeholder="John Doe"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
              </div>
            )}
          </form.Field>

          {/* Password Field */}
          <form.Field name="password">
            {(field) => (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Create Password</label>
                <Input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
              </div>
            )}
          </form.Field>

          <Button type="submit" className="w-full mt-2" disabled={isPending}>
            {isPending ? "Setting up account..." : "Join Team"}
          </Button>
        </form>
      </fieldset>
    </div>
  );
}
