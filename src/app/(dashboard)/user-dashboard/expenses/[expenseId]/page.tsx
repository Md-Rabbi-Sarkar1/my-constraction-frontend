"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetExpenseDetails } from "@/hooks/expenses.hook";

interface PageProps {
  params: Promise<{ expenseId: string }>;
}

export default function ExpenseDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const expenseId = unwrappedParams.expenseId as string;
  const router = useRouter();

  // 💡 Call your single expense data retrieval query hook
  const { data: rawResponse, isLoading, isError } = useGetExpenseDetails(expenseId);

  // ========================================================
  // 💡 BULLETPROOF EXPENSE DATA EXTRACTOR ENGINE:
  // Dynamically unpacks the matching single object block from any backend wrapper format
  // ========================================================
  const dataPayload = (rawResponse as any)?.data?.result || (rawResponse as any)?.result || rawResponse;

  const expense = Array.isArray(dataPayload)
    ? dataPayload.find((e: any) => e.id === expenseId)
    : dataPayload;

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
        Syncing invoice cost matrix data streams...
      </div>
    );
  }

  if (isError || !expense) {
    return (
      <div className="p-12 text-center text-red-500 font-semibold border rounded-lg bg-red-50 max-w-xl mx-auto mt-10">
        Failed to load the requested expense profile. Voucher record not found in database registry.
      </div>
    );
  }

  const projectLabel = expense.project?.name || "General Corporate Fund Overhead";
  const amountValue = expense.amount !== undefined ? Number(expense.amount) : 0;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER NAVIGATION SEGMENT */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-red-600 tracking-wide uppercase block mb-1">
            Voucher ID Scope: {expense.id}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Expense Voucher Profile</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push("/user-dashboard/expenses")}
          className="h-9 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          ← Back to Expenses List
        </Button>
      </div>

      {/* CORE FISCAL METRICS PROFILE CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Target Project Allocation Site</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">📁 {projectLabel}</h2>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Project ID: {expense.projectId}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Capital Outlay</span>
            <span className="text-xl font-mono font-extrabold text-red-600 block mt-1.5">
              ${amountValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Cost Center Category</span>
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200/60 mt-2 shadow-sm">
              {expense.category || "OTHER"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Invoicing Billing Date</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1.5">
              📅 {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : "—"}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Logged Record Timestamp</span>
            <span className="text-sm font-medium text-slate-400 block mt-1.5">
              {expense.createdAt ? new Date(expense.createdAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Cost Specifications Memo / Description</span>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed bg-slate-50/50 border border-slate-100 p-3.5 rounded-lg whitespace-pre-wrap">
            {expense.description || "No manual invoice auditing notations recorded for this capital item out."}
          </p>
        </div>

      </div>

      {/* LIFE-CYCLE ACTION REGISTRY ROW */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" className="border-slate-200 text-slate-700">
          Modify Voucher
        </Button>
        <Button variant="destructive">
          Delete Permanent Record
        </Button>
      </div>

    </div>
  );
}
