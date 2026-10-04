"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useGetCompanyProfile, useUpdateCompanyProfile } from "@/hooks/company.hook";

// 💡 Zod schema ensuring text field validations are sound before submission
const updateCompanySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters long"),
  slug: z.string().min(2, "Slug path text must be at least 2 characters long")
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and dashes"),
});

type FormValues = z.infer<typeof updateCompanySchema>;

export default function CompanySettingsPage() {
  const { data: company, isLoading, isError } = useGetCompanyProfile();
  const { mutateAsync: saveProfile, isPending } = useUpdateCompanyProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState("");

  const form = useForm({
    // Dynamically feed active server values on edit trigger
    defaultValues: {
      name: company?.name || "",
      slug: company?.slug || "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");

      const result = updateCompanySchema.safeParse(value);
      if (!result.success) {
        setFormError(result.error.issues[0]?.message || "Validation parsing constraint error.");
        return;
      }

      try {
        await saveProfile(result.data);
        setIsEditing(false);
        alert("Company profile updated successfully!");
      } catch (err: any) {
        setFormError(err?.message || "Failed to persist profile updates.");
      }
    },
  });

  if (isLoading) return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Syncing company profile data...</div>;
  if (isError || !company) return <div className="p-12 text-center text-red-500 font-semibold bg-red-50 border rounded-lg max-w-xl mx-auto mt-10">Error pulling company profile template.</div>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Company Profile</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Manage organization parameters, identification hashes, and dashboard branding assets.</p>
        </div>
        
        <Button 
          variant={isEditing ? "outline" : "default"}
          onClick={() => {
            setIsEditing(!isEditing);
            setFormError("");
            form.reset(); // Reset form values on toggle click
          }} 
          className="w-full sm:w-auto text-xs font-semibold h-9"
        >
          {isEditing ? "Cancel Modification" : "Edit Profile Details"}
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
        
        {/* BRANDING LOGO ROW */}
        <div className="flex items-center gap-4 border-b pb-5">
          <div className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold select-none">
            <span className="text-lg text-slate-500 font-black uppercase">
              {company.name ? company.name.slice(0, 2) : "AX"}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950">{company.name}</h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Organization ID Scope: @{company.id}</p>
          </div>
        </div>

        {/* 💡 INTERACTIVE EDITING FORM CONDITIONAL LAYOUT LAYER */}
        {isEditing ? (
          <form 
            onSubmit={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              form.handleSubmit(); 
            }} 
            className="space-y-4 text-xs"
          >
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Legal Company Name</label>
                  <input
                    required
                    disabled={isPending}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="slug">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Subdomain Route Slug</label>
                  <input
                    required
                    disabled={isPending}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none font-mono text-sm focus:border-slate-400"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            {formError && <p className="text-red-500 font-semibold text-xs mt-1">{formError}</p>}

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button 
                type="submit" 
                disabled={isPending}
                className="px-4 py-2 bg-slate-900 text-white font-semibold hover:bg-slate-800 text-xs transition disabled:opacity-50"
              >
                {isPending ? "Saving Changes..." : "Save Corporate Profile"}
              </Button>
            </div>
          </form>
        ) : (
          /* 💡 READ ONLY DATA DISCOVERY SHEET */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs pt-1 animate-in fade-in duration-100">
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Legal Entity Name</span>
              <div className="p-2.5 bg-slate-50 border rounded-md font-semibold text-slate-800 text-sm">
                {company.name || "—"}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">URL Path Slug</span>
              <div className="p-2.5 bg-slate-50 border rounded-md font-mono text-slate-600 text-sm">
                /{company.slug || "—"}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
