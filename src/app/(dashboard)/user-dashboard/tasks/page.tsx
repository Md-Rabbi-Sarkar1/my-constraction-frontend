"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetAllUsers } from "@/hooks";
import { useGetGlobalTasks } from "@/hooks/task.hook";

export default function GlobalTasksPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const { data: allUsers = [] } = useGetAllUsers();
  const usersArray = Array.isArray(allUsers) 
    ? allUsers 
    : (allUsers as any)?.data?.users || (allUsers as any)?.users || [];

  const activeFilters = {
    page,
    pageSize,
    status: status || undefined,
    priority: priority || undefined,
    assigneeId: assigneeId || undefined,
  };

  // 💡 Triggers hook with type alignment modifiers safely mapped
  const { data, isLoading, isError } = useGetGlobalTasks(activeFilters as any);
  const { tasks = [], totalPages = 1 } = data || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 antialiased text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Global Tasks Inventory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Cross-corporate pipeline directory covering all running milestones.</p>
      </div>

      {/* FILTER BOX SYSTEM */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl border shadow-sm text-xs">
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-slate-700">Pipeline Status</label>
          <select 
            className="border rounded-md p-2 bg-white outline-none cursor-pointer text-sm"
            value={status} 
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            {["TODO", "IN_PROGRESS", "BLOCKED", "REVIEW", "COMPLETED"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-slate-700">Priority Tier</label>
          <select 
            className="border rounded-md p-2 bg-white outline-none cursor-pointer text-sm"
            value={priority} 
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
          >
            <option value="">All Priorities</option>
            {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-slate-700">Assigned Crew Member</label>
          <select 
            className="border rounded-md p-2 bg-white outline-none cursor-pointer text-sm"
            value={assigneeId} 
            onChange={(e) => { setAssigneeId(e.target.value); setPage(1); }}
          >
            <option value="">All Employees</option>
            {usersArray.map((u: any) => (
              <option key={u.id} value={u.id}>{u.name || u.email}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse bg-white shadow-sm">Syncing task query parameter payload streams...</div>}
      {isError && <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">Error loading data framework.</div>}

      {/* DATA LAYOUT DISPLAY TABLE */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Task Particulars</th>
                  <th className="px-6 py-3 font-medium">Status Flag</th>
                  <th className="px-6 py-3 font-medium">Priority</th>
                  <th className="px-6 py-3 font-medium">Timeline Constraint</th>
                  <th className="px-6 py-3 font-medium text-right">Action View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task: any) => (
                  // 💡 FIXED: Uses task.id dynamically to map clean unique rendering keys safely
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="font-semibold text-slate-950">{task.title}</div>
                      {task.description && <div className="text-xs text-muted-foreground truncate max-w-xs font-normal mt-0.5">{task.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-700 uppercase">
                        {task.status || "TODO"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                        task.priority === "URGENT" || task.priority === "HIGH" ? "bg-red-50 text-red-600 font-extrabold" : "bg-slate-100 text-slate-600"
                      }`}>
                        {task.priority || "MEDIUM"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      <div>Start: {task.startDate ? new Date(task.startDate).toLocaleDateString() : "—"}</div>
                      <div className="mt-0.5">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/user-dashboard/tasks/${task.id}`)}
                        className="h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground italic">
                      No global pipeline tasks found matching your filter parameters context profile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION PANEL CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 pt-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                Previous Page
              </Button>
              <span className="text-xs font-bold text-slate-600 px-2">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>
                Next Page
              </Button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
