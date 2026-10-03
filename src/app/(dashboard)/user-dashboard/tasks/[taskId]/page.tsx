"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
// import { useGetTaskById } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { useGetTaskById } from "@/hooks/task.hook";

interface PageProps {
  params: Promise<{ projectId: string; taskId: string }>;
}

export default function TaskDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.projectId as string;
  const taskId = unwrappedParams.taskId as string;
  const router = useRouter();

  // 💡 Fetches the collection array data matrix context
  const { data: rawTaskData, isLoading, isError } = useGetTaskById(taskId);

  // 💡 FIXED ENGINE EXTRACTOR:
  // Since your backend returns an array of tasks, we look inside the collection
  // to find the specific item that matches the current taskId parameter from the URL
  const task = Array.isArray(rawTaskData)
    ? rawTaskData.find((item: any) => item.id === taskId)
    : rawTaskData;

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
        Loading task operational metrics...
      </div>
    );
  }

  // 💡 Triggers the fallback alert panel if matching ID wasn't recovered from the array
  if (isError || !task) {
    return (
      <div className="p-12 text-center text-red-500 font-semibold border rounded-lg bg-red-50 max-w-xl mx-auto mt-10">
        Failed to load the requested task lifecycle parameters. Task ID not found in database array.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER NAVIGATION SECTION */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 tracking-wide uppercase block mb-1">
            Task ID Scope: {task.id}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Task Profile Overview</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/user-dashboard/tasks/`)}
          className="h-9 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          ← Back to Tasks List
        </Button>
      </div>

      {/* CORE SPECIFICATIONS CARD DISPLAY PANEL */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Task Title</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">{task.title}</h2>
        </div>

        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Operational Description</span>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed bg-slate-50/50 border border-slate-100 p-3.5 rounded-lg whitespace-pre-wrap">
            {task.description || "No specific instructions mapped to this milestone record item."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Pipeline Status</span>
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100 mt-1.5 shadow-sm">
              {task.status || "TODO"}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Priority Level</span>
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-extrabold uppercase mt-1.5 border shadow-sm ${
              task.priority === "URGENT" || task.priority === "HIGH" 
                ? "bg-red-50 text-red-600 border-red-100" 
                : "bg-slate-100 text-slate-600 border-slate-200/60"
            }`}>
              {task.priority}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Start Timestamp</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1.5">
              {task.startDate ? new Date(task.startDate).toLocaleString() : "—"}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Due Deadline Target</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1.5">
              {task.dueDate ? new Date(task.dueDate).toLocaleString() : "—"}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Allocated Crew Operator Asset ID</span>
          <div className="mt-2 p-3 bg-slate-50/50 rounded-lg border border-slate-100 flex items-center justify-between max-w-sm">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {task.assignee?.name || "Assigned Operator Profile"}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {task.assigneeId || "Unassigned Operational Task"}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* FUNCTION BUTTON SLOTS: Actions to map in the future stages */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" className="border-slate-200 text-slate-700">
          Edit Fields
        </Button>
        <Button variant="destructive">
          Delete Task Permanent
        </Button>
      </div>

    </div>
  );
}
