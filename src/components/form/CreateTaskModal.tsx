"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useGetProjectMembers } from "@/hooks";
import { useCreateProjectTask } from "@/hooks/task.hook";
import { toast } from "../ui/toast";


interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  startDate: z.string().min(1, "Start date timestamp is required"),
  assigneeId: z.string().min(1, "Please select a team member from the dropdown menu"), // 💡 Accept string first, validate on match
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"] as const),
  dueDate: z.string().min(1, "Due date timestamp is required"),
});

type FormValues = z.infer<typeof createTaskSchema>;

export function CreateTaskModal({ isOpen, onClose, projectId }: CreateTaskModalProps) {
  const [formError, setFormError] = useState("");
  const { data: projectMembers = [] } = useGetProjectMembers(projectId);
  const { mutateAsync: createTask, isPending } = useCreateProjectTask(projectId);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      assigneeId: "",
      priority: "MEDIUM" as const,
      dueDate: "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");

      // Convert local date picker formats to ISO string stamps matching payload requirements
      const payload = {
        ...value,
        startDate: value.startDate ? new Date(value.startDate).toISOString() : "",
        dueDate: value.dueDate ? new Date(value.dueDate).toISOString() : "",
      };

      const result = createTaskSchema.safeParse(payload);
      
      if (!result.success) {
        const errorMsg = result.error.issues?.[0]?.message || "Form validation error occurred.";
        setFormError(errorMsg);
        return;
      }

      try {
        await createTask(result.data);
        form.reset();
        setFormError("");
        onClose();
        toast.add({ title: "Task created successfully!"});
        
      } catch (err: any) {
        setFormError(err?.message || "Failed to finalize task creation.");
      }
    },
  });

  if (!isOpen) return null;

  // Safeguard array data extraction mappings
  const membersArray = Array.isArray(projectMembers)
    ? projectMembers
    : (projectMembers as any)?.data?.result || (projectMembers as any)?.result || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Create New Project Task</h3>
          <p className="text-xs text-slate-500 mt-0.5">Map an operational target constraint inside the column rows.</p>
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
                <label className="font-bold text-slate-700">Task Title</label>
                <input
                  required
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Migrate Database to Production Server"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Description</label>
                <textarea
                  required
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm min-h-[70px] focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Switch the database connection string to remote instance details context guidelines..."
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="startDate">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Start Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="dueDate">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Due Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="priority">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Priority Level</label>
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
                  <label className="font-bold text-slate-700">Assign Member</label>
                  <select
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="">Choose project technician...</option>
                    {membersArray.map((m: any) => {
                      // 💡 FIXED: Uses email as the HTML tracking key loop attribute to eliminate duplicate "" keys crash
                      const mappingKey = m.email || Math.random().toString();
                      
                      // Fallback check: Use email if backend route doesn't return a explicit string ID parameter
                      const valuePayload = m.id || m.userId || m.email;

                      return (
                        <option key={mappingKey} value={valuePayload}>
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
              className="px-4 py-2 border border-slate-200 rounded-md font-semibold text-slate-700 bg-white hover:bg-slate-50 text-xs transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-800 text-xs transition disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
