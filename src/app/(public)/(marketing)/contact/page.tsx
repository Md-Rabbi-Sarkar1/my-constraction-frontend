"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

// 💡 1. Zod Validation Schema for incoming customer inquiries
const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid company email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters long"),
  message: z.string().min(10, "Message details must be at least 10 characters long"),
});

type FormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");
      setIsSubmitting(true);

      const result = contactFormSchema.safeParse(value);
      if (!result.success) {
        setFormError(result.error.issues[0]?.message || "Validation error occurred.");
        setIsSubmitting(false);
        return;
      }

      try {
        // 💡 Simulated endpoint request stream delay loop
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        console.log("Contact form payload committed successfully:", result.data);
        form.reset();
        toast.add({ title: "Thank you! Your corporate consultation ticket has been logged successfully."});
        
      } catch (err: any) {
        setFormError(err?.message || "Failed to transmit message payload. Plz try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 antialiased selection:bg-slate-950 selection:text-white">
      
      {/* HERO SECTION */}
      <div className="bg-white border-b border-slate-200 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Connect With Us
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 leading-none">
            Get in Touch with our Support Teams
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed pt-1">
            Have questions about system endpoints, role access, or enterprise deployment modules? Message us directly.
          </p>
        </div>
      </div>

      {/* CORE CONTENT DUAL-PANEL GRID */}
      <div className="py-12 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        {/* OFFICE CHANNELS LOGISTICS INFO (2 COLS) */}
        <div className="md:col-span-2 space-y-6 text-xs font-medium text-slate-600">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold tracking-tight text-slate-950">Corporate Logistics Depot</h2>
            <p className="text-[11px] text-muted-foreground">Direct communication support links matrix paths.</p>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex gap-3">
              <span className="text-base">📍</span>
              <div>
                <p className="font-bold text-slate-950">Headquarters Vault Location</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  100 Infrastructure Way, Suite 400<br />
                  Silicon Valley, CA 94025
                </p>
              </div>
            </div>

            <div className="flex gap-3 border-t pt-3">
              <span className="text-base">✉️</span>
              <div>
                <p className="font-bold text-slate-950">Support Data Pipeline</p>
                <p className="text-blue-600 font-semibold font-mono mt-0.5 hover:underline">
                  support@construction-platform.local
                </p>
              </div>
            </div>

            <div className="flex gap-3 border-t pt-3">
              <span className="text-base">📞</span>
              <div>
                <p className="font-bold text-slate-950">Direct Consultation Line</p>
                <p className="text-slate-500 font-mono mt-0.5">+1 (555) 234-8950</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-100 border p-4 rounded-xl text-slate-500 leading-relaxed text-[11px]">
            ⏳ <b>Operating Window Limits:</b> Our support servers actively parse incoming corporate inquiries Monday through Friday, 08:00 to 18:00 EST parameters context.
          </div>
        </div>

        {/* INTERACTIVE FORM SYSTEM CARD (3 COLS) */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4 text-xs"
          >
            <form.Field name="fullName">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Full Name</label>
                  <input
                    required
                    disabled={isSubmitting}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400 disabled:bg-slate-100"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Company Email Address</label>
                  <input
                    required
                    type="email"
                    disabled={isSubmitting}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400 disabled:bg-slate-100"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="john@company.com"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="subject">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Inquiry Subject</label>
                  <input
                    required
                    disabled={isSubmitting}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400 disabled:bg-slate-100"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="e.g. Enterprise Tier Pricing Consultation"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="message">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Detailed Message</label>
                  <textarea
                    required
                    disabled={isSubmitting}
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm min-h-[100px] focus:border-slate-400 disabled:bg-slate-100"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Provide detailed information regarding your inquiry..."
                  />
                </div>
              )}
            </form.Field>

            {formError && <p className="text-red-500 font-semibold text-xs mt-1">{formError}</p>}

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-xs font-semibold h-9 bg-slate-900 hover:bg-slate-800 text-white transition disabled:opacity-50"
              >
                {isSubmitting ? "Transmitting Ticket..." : "Send Consultation Request"}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
