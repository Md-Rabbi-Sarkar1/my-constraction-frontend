"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { useGetProjects } from "@/hooks"; // 💡 Reuses your existing project list hook system
import { useRecordTransaction } from "@/hooks/material.hook";

interface RecordTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialId: string;
}

const transactionSchema = z.object({
  type: z.enum(["PURCHASE", "USAGE", "ADJUSTMENT"] as const),
  quantity: z.number().positive("Quantity metric parameter volume must be greater than zero"),
  projectId: z.string().optional(),
  note: z.string().optional(),
});

type FormValues = {
  type: "PURCHASE" | "USAGE" | "ADJUSTMENT";
  quantity: string;
  projectId: string;
  note: string;
};

export function RecordTransactionModal({ isOpen, onClose, materialId }: RecordTransactionModalProps) {
  const [formError, setFormError] = useState("");
  const { data: rawProjects } = useGetProjects(); // Fetch active client projects
  const { mutateAsync: logTransaction, isPending } = useRecordTransaction(materialId);

  // Unpack array according to previous structural parsing technique definitions
  const projectsArray = Array.isArray(rawProjects)
    ? rawProjects
    : (rawProjects as any)?.data?.result || (rawProjects as any)?.result || [];

  const form = useForm({
    defaultValues: { type: "PURCHASE", quantity: "", projectId: "", note: "" } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");

      const payload = {
        type: value.type,
        quantity: Number(value.quantity),
        projectId: value.projectId || undefined,
        note: value.note || undefined,
      };

      const result = transactionSchema.safeParse(payload);
      if (!result.success) {
        setFormError(result.error.issues?.[0]?.message || "Validation constraint error.");
        return;
      }

      try {
        await logTransaction(result.data);
        form.reset();
        onClose();
        alert("Stock ledger transaction updated successfully!");
      } catch (err: any) {
        setFormError(err?.message || "Failed to commit record entry.");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Record Material Ledger Transaction</h3>
          <p className="text-xs text-slate-500 mt-0.5">Advance supply logs, purchase intake limits, or structural usages weights.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-4 text-xs">
          <form.Field name="type">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Transaction Type Action</label>
                <select className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value as any)}>
                  <option value="PURCHASE">➕ PURCHASE (Increase Stock)</option>
                  <option value="USAGE">➖ USAGE (Allocate to Project Site)</option>
                  <option value="ADJUSTMENT">🔧 ADJUSTMENT (Manual Stock Override)</option>
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="quantity">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Quantity Amount</label>
                <input required type="number" min="1" className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="Enter material transaction size..." />
              </div>
            )}
          </form.Field>

          <form.Field name="projectId">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Link Project Assignment Site</label>
                <select className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                  <option value="">Leave unlinked (General Stockyard Depot)</option>
                  {projectsArray.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {/* 💡 Displays Project Name clearly for humans */}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="note">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Audit Memo / Note</label>
                <textarea className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm min-h-[50px] focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. Received from primary vendor logistics chain allocation..." />
              </div>
            )}
          </form.Field>

          {formError && <p className="text-red-500 font-semibold text-xs mt-1">{formError}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button type="button" disabled={isPending} onClick={() => { form.reset(); setFormError(""); onClose(); }} className="px-4 py-2 border rounded-md font-semibold text-slate-700 bg-white hover:bg-slate-50 text-xs transition">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-800 text-xs transition disabled:opacity-50">
              {isPending ? "Processing..." : "Commit Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
