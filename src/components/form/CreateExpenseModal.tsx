"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { useGetProjects } from "@/hooks"; 
import { useCreateExpense } from "@/hooks/expenses.hook";
import { toast } from "../ui/toast";

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createExpenseSchema = z.object({
  projectId: z.string().uuid("Please select a valid project from the dropdown menu"),
  category: z.enum(["MATERIALS", "LABOR", "TRANSPORTATION", "EQUIPMENT", "OTHER"] as const),
  amount: z.number().positive("Expense allocation size value amount must be greater than zero"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  expenseDate: z.string().min(1, "Expense date registration timestamp is required"),
});

type FormValues = z.infer<typeof createExpenseSchema>;

export function CreateExpenseModal({ isOpen, onClose }: CreateExpenseModalProps) {
  const [formError, setFormError] = useState("");
  const { data: rawProjects } = useGetProjects();
  const { mutateAsync: spawnExpense, isPending } = useCreateExpense();

  const projectsArray = Array.isArray(rawProjects)
    ? rawProjects
    : (rawProjects as any)?.data?.result || (rawProjects as any)?.result || [];

  const form = useForm({
    defaultValues: {
      projectId: "",
      category: "MATERIALS",
      amount: 0,
      description: "",
      expenseDate: "",
    } as any,
    onSubmit: async ({ value }) => {
      setFormError("");

      const payload = {
        ...value,
        amount: Number(value.amount),
        expenseDate: value.expenseDate ? new Date(value.expenseDate).toISOString() : "",
      };

      const result = createExpenseSchema.safeParse(payload);
      if (!result.success) {
        // 💡 FIXED: Read the message safely from the first index entry of the issues array block
        const errorMsg = result.error.issues[0]?.message || "Validation constraint error.";
        setFormError(errorMsg);
        return;
      }

      try {
        await spawnExpense(result.data);
        form.reset();
        onClose();
        toast.add({ title: "Expense record logged successfully!"});
        
      } catch (err: any) {
        setFormError(err?.message || "Failed to save expense log.");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Record Company Expense</h3>
          <p className="text-xs text-slate-500 mt-0.5">Log capital costs, operational liabilities, or project supply balances.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 text-xs"
        >
          <form.Field name="projectId">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Link Project Site Target</label>
                <select
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Choose matching project layout...</option>
                  {projectsArray.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="category">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Expense Category Cost Center</label>
                <select
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as any)}
                >
                  {["MATERIALS", "LABOR", "TRANSPORTATION", "EQUIPMENT", "OTHER"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="amount">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Amount Size ($)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="expenseDate">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Expense Billing Date</label>
                  <input
                    required
                    type="date"
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Cost Specifications Memo</label>
                <textarea
                  required
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm min-h-[50px] focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Provide explicit operational invoicing specifics details..."
                />
              </div>
            )}
          </form.Field>

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
              className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-800 text-xs transition"
            >
              {isPending ? "Logging..." : "Log Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
