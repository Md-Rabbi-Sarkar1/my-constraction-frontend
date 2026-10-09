"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { useGetProjects } from "@/hooks"; 
import { useCreateDocument } from "@/hooks/documents.hook";
import { toast } from "../ui/toast";

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const createDocumentSchema = z.object({
  projectId: z.string().uuid("Please select a valid project from the dropdown menu"),
  name: z.string().min(2, "Document name file designation description is required"),
  type: z.string().min(1, "Document classification category is required (e.g. BLUEPRINT, CONTRACT)"),
  mimeType: z.string().min(1, "File format type signature string is required"),
  sizeBytes: z.number().positive("File dimension storage capacity metrics weight must be greater than zero"),
  storageKey: z.string().optional(),
});

type FormValues = {
  projectId: string;
  type: string;
  name: string;
  mimeType: string;
  sizeBytes: string;
  storageKey: string;
};

export function CreateDocumentModal({ isOpen, onClose }: CreateDocumentModalProps) {
  const [formError, setFormError] = useState("");
  const { data: rawProjects } = useGetProjects();
  const { mutateAsync: spawnDocument, isPending } = useCreateDocument();

  const projectsArray = Array.isArray(rawProjects)
    ? rawProjects
    : (rawProjects as any)?.data?.result || (rawProjects as any)?.result || [];

  const form = useForm({
    defaultValues: {
      projectId: "",
      name: "",
      type: "BLUEPRINT",
      mimeType: "application/pdf",
      sizeBytes: "",
      storageKey: "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");

      const payload = {
        ...value,
        sizeBytes: Number(value.sizeBytes),
        storageKey: value.storageKey || undefined,
      };

      const result = createDocumentSchema.safeParse(payload);
      if (!result.success) {
        // 💡 FIXED: Safely grab the validation string from the first array index element
        const errorMsg = result.error.issues[0]?.message || "Validation constraint error.";
        setFormError(errorMsg);
        return;
      }

      try {
        await spawnDocument(result.data);
        form.reset();
        setFormError("");
        onClose();
        toast.add({ title: "Document registry entry committed successfully!"});
        
      } catch (err: any) {
        setFormError(err?.message || "Failed to finalize document filing log.");
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">File Corporate Document</h3>
          <p className="text-xs text-slate-500 mt-0.5">Commit site blueprints, contract records, or logistical engineering catalogs.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="space-y-4 text-xs">
          <form.Field name="projectId">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Link Project Site Target</label>
                <select className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                  <option value="">Select project layout container...</option>
                  {projectsArray.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>

          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Document File Name</label>
                <input required className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. Structural Blueprint Phase 2 Revision" />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="type">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Log Category Type</label>
                  <select className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                    <option value="BLUEPRINT">BLUEPRINT</option>
                    <option value="CONTRACT">CONTRACT</option>
                    <option value="PERMIT">PERMIT</option>
                    <option value="INVOICE">INVOICE</option>
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field name="mimeType">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">MIME Format Specification</label>
                  <input required className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. application/pdf" />
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="sizeBytes">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Storage Volume Size (Bytes)</label>
                  <input required type="number" min="1" className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. 4194304" />
                </div>
              )}
            </form.Field>

            <form.Field name="storageKey">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Cloud Storage Key string</label>
                  <input className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm focus:border-slate-400" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. vault/doc-uuid.pdf" />
                </div>
              )}
            </form.Field>
          </div>

          {formError && <p className="text-red-500 font-semibold text-xs mt-1">{formError}</p>}

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button type="button" disabled={isPending} onClick={() => { form.reset(); setFormError(""); onClose(); }} className="px-4 py-2 border rounded-md font-semibold text-slate-700 bg-white hover:bg-slate-50 text-xs transition">Cancel</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-800 text-xs transition">
              {isPending ? "Filing..." : "Save Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
