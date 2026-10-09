"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useGetProjectMembers } from "@/hooks";
import { useCreateProjectIssue } from "@/hooks/issues.hook";
import { toast } from "../ui/toast";


interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const createIssueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  location: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"] as const).optional(),
  assigneeId: z.string().optional(),
});

type FormValues = z.infer<typeof createIssueSchema>;

export function CreateIssueModal({ isOpen, onClose, projectId }: CreateIssueModalProps) {
  const [formError, setFormError] = useState("");
  const { data: projectMembers = [] } = useGetProjectMembers(projectId);
  const { mutateAsync: spawnIssue, isPending } = useCreateProjectIssue(projectId);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      priority: "MEDIUM" as const,
      assigneeId: "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");

      // Normalize blanks to undefined to match optional schema validation
      const payload = {
        ...value,
        location: value.location || undefined,
        priority: value.priority || undefined,
        assigneeId: value.assigneeId || undefined,
      };

      const result = createIssueSchema.safeParse(payload);
      if (!result.success) {
        setFormError(result.error.issues?.[0]?.message || "Validation check failed.");
        return;
      }

      try {
        await spawnIssue(result.data);
        form.reset();
        onClose();
        toast.add({ title: "Project log issue created successfully!"});
        
      } catch (err: any) {
        setFormError(err?.message || "Failed to commit issue registration.");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Report Project Issue</h3>
          <p className="text-xs text-slate-500 mt-0.5">Log structural blockages, site incidents, or structural conflicts.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 text-xs"
        >
          <form.Field name="title">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Issue Title / Subject</label>
                <input
                  required
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Concrete Mixture Cracking Level-2"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Detailed Description</label>
                <textarea
                  required
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm min-h-[60px] focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Describe situational blockage parameters..."
                />
              </div>
            )}
          </form.Field>

          <form.Field name="location">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Site Location (Optional)</label>
                <input
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Sector 3 Northwest Corner"
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="priority">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Severity Tier</label>
                  <select
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value as any)}
                  >
                    {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field name="assigneeId">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Assign Inspector</label>
                  <select
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="">Leave Unassigned</option>
                    {projectMembers.map((m: any) => {
                      const uid = m.userId || m.id || m.user?.id || "";
                      return (
                        <option key={m.email || uid} value={uid}>
                          {m.name || m.email}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </form.Field>
          </div>

          {formError && <p className="text-red-500 font-semibold text-xs mt-1">{formError}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              disabled={isPending}
              onClick={() => { form.reset(); setFormError(""); onClose(); }}
              className="px-4 py-2 border rounded-md font-semibold text-slate-700 bg-white hover:bg-slate-50 text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-800 text-xs transition disabled:opacity-50"
            >
              {isPending ? "Logging..." : "Log Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
