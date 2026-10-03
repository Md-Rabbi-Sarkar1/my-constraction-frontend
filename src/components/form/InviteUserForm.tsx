"use client"
import React from "react";
import { useForm } from "@tanstack/react-form";

// Shadcn UI Components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// আপনার প্রজেক্টের ভ্যালিডেশন স্কিমা অনুযায়ী টাইপ ইমপোর্ট করুন (যদি আলাদা থাকে)
// এখানে একটি জেনেরিক টাইপ স্ট্রাকচার দেওয়া হলো:
interface InviteUserInput {
  name: string;
  email: string;
  role: string;
}

const ROLES = ["ADMIN", "PROJECT_MANAGER", "ENGINEER", "WORKER"];

export function InviteUserForm({ 
  onSuccess, 
  isSubmitting, 
  onInvite 
}: { 
  onSuccess?: () => void;
  isSubmitting?: boolean;
  onInvite: (values: InviteUserInput) => void;
}) {

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "WORKER", // ডিফল্ট রোল সেট করা হলো
    } as InviteUserInput,
    onSubmit: async ({ value }) => {
      // মেইন পেজ থেকে আসা অন-ইনভাইট ফাংশনটি কল হবে
      await onInvite(value);
      form.reset();
      if (onSuccess) onSuccess();
    },
  });

  return (
    <form
      id="invite-user-form" // 💡 এই আইডিটি মোডালের বাইরের সাবমিট বাটনের জন্য জরুরি
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Company Role Field */}
      <form.Field name="role">
        {(field) => (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Company Role</label>
            <Select
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value)}
            >
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
            {field.state.meta.errors && (
              <p className="text-red-500 text-xs mt-1">{field.state.meta.errors.join(", ")}</p>
            )}
          </div>
        )}
      </form.Field>
    </form>
  );
}
