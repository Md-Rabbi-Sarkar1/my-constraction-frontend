"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { CreateExpenseModal } from "@/components/form/CreateExpenseModal";

import { Button } from "@/components/ui/button";
import { useGetExpenses } from "@/hooks/expenses.hook";
import { ExpenseItem } from "@/api/expenses.api";

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: rawExpenses, isLoading, isError } = useGetExpenses();

  // Handle direct array unwrap matching previous technique format rules definitions
  const expenses: ExpenseItem[] = Array.isArray(rawExpenses) ? rawExpenses : [];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 antialiased text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">Corporate Expenses Ledger</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Track financial outlays, project billings parameters, and cost center categories weights.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto text-xs sm:text-sm">
          Create Expense Log
        </Button>
      </div>

      {isLoading && <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse bg-white shadow-sm">Syncing fiscal accounts data logs...</div>}
      {isError && <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">Error establishing transactional data server stream.</div>}

      {/* MASTER EXPENSES RECORDS TABLE */}
      {!isLoading && !isError && (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-medium">Target Project Site</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Cost Category</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Amount Outlay</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Billing Date</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((item: any, index: number) => {
                  const expenseId = item.id || `expense-${index}`;
                  const projectLabel = item.project?.name || "General General Fund Overhead";
                  const amountValue = item.amount !== undefined ? Number(item.amount) : 0;

                  return (
                    <tr key={expenseId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-bold text-slate-950 truncate max-w-[200px]">
                        📁 {projectLabel}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold rounded bg-slate-100 text-slate-700 uppercase">
                          {item.category || "OTHER"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-red-600">
                        \${amountValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-medium text-slate-500">
                        {item.expenseDate ? new Date(item.expenseDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          // 💡 Pushes browser routing straight to the standalone expense sub-details viewport path
                          onClick={() => router.push(`/user-dashboard/expenses/${expenseId}`)}
                          className="h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-12 text-center text-sm text-muted-foreground italic">
                      No matching company expense transactions recorded under this directory shell ledger yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ISOLATED COMPONENT CALL */}
      <CreateExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
