"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useCreateMaterial } from "@/hooks/material.hook";
import { toast } from "../ui/toast";
// import { useCreateMaterial } from "@/hooks/useMaterials";

interface CreateMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 💡 Zod schema enforces numeric entries for stock tracking fields
const createMaterialSchema = z.object({
  name: z.string().min(2, "Material name must be at least 2 characters long"),
  unit: z.string().min(1, "Unit designation is required (e.g. Bags, Tons, Pcs)"),
  currentStock: z.number().nonnegative("Current stock parameter cannot be less than zero").optional(),
  reorderLevel: z.number().nonnegative("Reorder target metric cannot be less than zero").optional(),
});

type FormValues = {
  name: string;
  unit: string;
  currentStock: string;
  reorderLevel: string;
};

export function CreateMaterialModal({ isOpen, onClose }: CreateMaterialModalProps) {
  const [formError, setFormError] = useState("");
  const { mutateAsync: spawnMaterial, isPending } = useCreateMaterial();

  const form = useForm({
    defaultValues: {
      name: "",
      unit: "",
      currentStock: "0",
      reorderLevel: "0",
    } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");

      // 💡 Transform string values into numbers cleanly right before validation execution
      const structuredPayload = {
        name: value.name,
        unit: value.unit,
        currentStock: value.currentStock ? Number(value.currentStock) : undefined,
        reorderLevel: value.reorderLevel ? Number(value.reorderLevel) : undefined,
      };

      const result = createMaterialSchema.safeParse(structuredPayload);
      if (!result.success) {
        const errorMsg = result.error.issues?.[0]?.message || "Validation parsing constraint error.";
        setFormError(errorMsg);
        return;
      }

      try {
        await spawnMaterial(result.data);
        form.reset();
        setFormError("");
        onClose();
        toast.add({ title: "Inventory material item added successfully!"});
       
      } catch (err: any) {
        setFormError(err?.message || "Failed to commit inventory entry.");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Add Logistics Material</h3>
          <p className="text-xs text-slate-500 mt-0.5">Register structural consumables or building equipment blocks.</p>
        </div>

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
                <label className="font-bold text-slate-700">Material Designation Name</label>
                <input
                  required
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Portland Cement (Grade 53)"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="unit">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Measurement Unit metric</label>
                <input
                  required
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Bags, Tons, Metric Cubes"
                />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="currentStock">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Initial Stock Volume</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="reorderLevel">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Alert Reorder Level threshold</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
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
              {isPending ? "Registering..." : "Add Material"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
