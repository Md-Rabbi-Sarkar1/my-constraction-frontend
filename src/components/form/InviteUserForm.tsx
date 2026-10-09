"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useInviteUser } from "@/hooks";
import { InviteFormValues, inviteUserSchema } from "@/validation/user.validation";
import { toast } from "../ui/toast";

const ROLES = ["ADMIN", "PROJECT_MANAGER", "ENGINEER", "WORKER"] as const;

interface InviteUserFormProps {
  onSuccess?: () => void;
}

export function InviteUserForm({ onSuccess }: InviteUserFormProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { mutateAsync: sendInvite, isPending } = useInviteUser(); // 👈 Mutation localized

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "WORKER",
    } as InviteFormValues,
    onSubmit: async ({ value }) => {
      setFieldErrors({});
      
      // 1. Validate using Zod schema on submit
      const result = inviteUserSchema.safeParse(value);
      
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

      // 2. Perform the async API dispatch directly here
      try {
        await sendInvite(result.data);
        toast.add({ title: "User invitation sent successfully!"});
       
        form.reset();
        if (onSuccess) onSuccess();
      } catch (err) {
        toast.add({ title: "Failed to send user invitation."});
        
      }
    },
  });

  return (
    <fieldset disabled={isPending} className="space-y-4 w-full">
      <form
        id="invite-user-form"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4 w-full"
      >
        {/* Full Name Field */}
        <form.Field name="name">
          {(field) => (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input
                required
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. John Doe"
              />
              {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
            </div>
          )}
        </form.Field>

        {/* Email Field */}
        <form.Field name="email">
          {(field) => (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input
                required
                type="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="name@company.com"
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>
          )}
        </form.Field>

        {/* Company Role Field */}
        <form.Field name="role">
          {(field) => (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Company Role</label>
              <Select value={field.state.value} onValueChange={(value) => field.handleChange(value as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.role && <p className="text-red-500 text-xs mt-1">{fieldErrors.role}</p>}
            </div>
          )}
        </form.Field>
        
        {/* Hidden loading context inside the form layout if needed */}
        {isPending && <p className="text-xs text-muted-foreground animate-pulse text-right">Sending invite link...</p>}
      </form>
    </fieldset>
  );
}
