"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { useGetProjects } from "@/hooks";
import { useCreateDailyReport } from "@/hooks/report.hook";

interface CreateDailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 💡 1. Core Worker sub-structure validator schema parameters
const workerLogSchema = z.object({
  name: z.string().min(1, "Worker name is required"),
  role: z.string().optional(),
  hoursWorked: z.number().nonnegative().optional(),
});

// 💡 2. Main Daily Report validator layout schema rules
const createDailyReportSchema = z.object({
  projectId: z.string().uuid("Please select a valid project from the dropdown menu"),
  reportDate: z.string().min(1, "Report date timestamp is required"),
  workCompleted: z.string().min(3, "Work completed log field is required"),
  hoursWorked: z.number().nonnegative("Hours worked must be a positive number"),
  progressPct: z.number().min(0).max(100, "Progress percentage must be between 0 and 100"),
  workers: z.array(workerLogSchema).min(1, "Please track at least one worker log row entry"),
  materialsUsed: z.string().optional(),
  problemsEncountered: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = {
  projectId: string;
  reportDate: string;
  workCompleted: string;
  hoursWorked: string;
  progressPct: string;
  materialsUsed: string;
  problemsEncountered: string;
  notes: string;
};
export function CreateDailyReportModal({ isOpen, onClose }: CreateDailyReportModalProps) {
  const [formError, setFormError] = useState("");
  const { data: rawProjects } = useGetProjects();
  const { mutateAsync: spawnReport, isPending } = useCreateDailyReport();

  // Local state to track workers dynamically before binding to TanStack submission
  const [workersList, setWorkersList] = useState<{ name: string; role: string; hoursWorked: string }[]>([]);
  const [wName, setWName] = useState("");
  const [wRole, setWRole] = useState("");
  const [wHours, setWHours] = useState("");

  const addWorkerToLocalList = () => {
    if (!wName.trim()) return;
    setWorkersList([...workersList, { name: wName, role: wRole, hoursWorked: wHours }]);
    setWName("");
    setWRole("");
    setWHours("");
  };

  const removeWorkerFromLocalList = (idx: number) => {
    setWorkersList(workersList.filter((_, i) => i !== idx));
  };

  const projectsArray = Array.isArray(rawProjects)
    ? rawProjects
    : (rawProjects as any)?.data?.result || (rawProjects as any)?.result || [];

  const form = useForm({
    defaultValues: {
      projectId: "",
      reportDate: "",
      workCompleted: "",
      hoursWorked: "",
      progressPct: "",
      materialsUsed: "",
      problemsEncountered: "",
      notes: "",
    } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");

      // Convert local string states into precise numeric values for Zod checks
      const payload = {
        ...value,
        hoursWorked: Number(value.hoursWorked || 0),
        progressPct: Number(value.progressPct || 0),
        reportDate: value.reportDate ? new Date(value.reportDate).toISOString() : "",
        workers: workersList.map(w => ({
          name: w.name,
          role: w.role || undefined,
          hoursWorked: w.hoursWorked ? Number(w.hoursWorked) : undefined
        })),
        materialsUsed: value.materialsUsed || undefined,
        problemsEncountered: value.problemsEncountered || undefined,
        notes: value.notes || undefined,
      };

      const result = createDailyReportSchema.safeParse(payload);
      if (!result.success) {
        const errorMsg = result.error.issues?.[0]?.message || "Validation constraint error.";
        setFormError(errorMsg);
        return;
      }

      try {
        await spawnReport(result.data);
        form.reset();
        setWorkersList([]);
        setFormError("");
        onClose();
        alert("Daily Field Report logged successfully!");
      } catch (err: any) {
        setFormError(err?.message || "Failed to finalize field log entry.");
      }
    },
  });

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full border p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div>
          <h3 className="text-lg font-bold text-slate-950">File Daily Construction Report</h3>
          <p className="text-xs text-slate-500 mt-0.5">Commit site metrics parameters, crew hours, and materials tracking.</p>
        </div>

        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            form.handleSubmit(); 
          }} 
          className="space-y-4 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field name="projectId">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Project Target Link</label>
                  <select className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white cursor-pointer" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}>
                    <option value="">Choose matching site...</option>
                    {projectsArray.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}
            </form.Field>

            <form.Field name="reportDate">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Reporting Date</label>
                  <input type="date" required className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm bg-white" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="workCompleted">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Detailed Work Completed</label>
                <textarea required className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm min-h-[50px]" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. Completed second floor column casting..." />
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="hoursWorked">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Total Shift Hours Worked</label>
                  <input required type="number" step="0.5" className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                </div>
              )}
            </form.Field>

            <form.Field name="progressPct">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Progress Incremented (%)</label>
                  <input required type="number" min="0" max="100" className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                </div>
              )}
            </form.Field>
          </div>
          {/* DYNAMIC LABOR CREW TRACKING MATRIX SECTION */}
          <div className="border border-slate-200 p-3 rounded-lg bg-slate-50/50 space-y-3">
            <label className="font-bold text-slate-800 block text-xs">Dynamic Crew Allocation Logs</label>
            <div className="grid grid-cols-3 gap-2">
              <input type="text" className="border rounded p-1.5 bg-white text-xs" placeholder="Worker Name" value={wName} onChange={(e) => setWName(e.target.value)} />
              <input type="text" className="border rounded p-1.5 bg-white text-xs" placeholder="Role" value={wRole} onChange={(e) => setWRole(e.target.value)} />
              <input type="number" className="border rounded p-1.5 bg-white text-xs" placeholder="Hours" value={wHours} onChange={(e) => setWHours(e.target.value)} />
            </div>
            <button type="button" onClick={addWorkerToLocalList} className="px-3 py-1 bg-slate-200 hover:bg-slate-300 font-bold rounded text-[11px] text-slate-800">
              ➕ Add Worker Row
            </button>

            {/* List Active Worker rows containing strict string fallbacks for keys */}
            <div className="space-y-1.5 max-h-[100px] overflow-y-auto pt-1">
              {workersList.map((wl, idx) => {
                const uniqueRowKey = wl.name ? `${wl.name}-${idx}` : `worker-row-${idx}`;
                return (
                  <div key={uniqueRowKey} className="flex justify-between items-center bg-white border px-2 py-1 rounded text-[11px]">
                    <span><b>{wl.name}</b> ({wl.role || "General"}) — {wl.hoursWorked || 0} hrs</span>
                    <button type="button" onClick={() => removeWorkerFromLocalList(idx)} className="text-red-500 font-bold hover:underline">Remove</button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field name="materialsUsed">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Materials Consumed (Optional)</label>
                  <input className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. 50 Bags Cement" />
                </div>
              )}
            </form.Field>

            <form.Field name="problemsEncountered">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Problems / Delay Impediments</label>
                  <input className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="e.g. Rain delayed casting" />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="notes">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">General Notes / Remarks</label>
                <input className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none text-sm" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} placeholder="Site cleared cleanly at end of shift." />
              </div>
            )}
          </form.Field>

          {formError && <p className="text-red-500 font-semibold text-xs mt-1">{formError}</p>}

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button type="button" disabled={isPending} onClick={() => { form.reset(); setWorkersList([]); setFormError(""); onClose(); }} className="px-4 py-2 border rounded-md font-semibold text-slate-700 bg-white hover:bg-slate-50 text-xs transition">Cancel</button>
            <button type="submit" disabled={isPending || workersList.length === 0} className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-md hover:bg-slate-800 text-xs transition disabled:opacity-50">
              {isPending ? "Submitting..." : "Submit Daily Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
