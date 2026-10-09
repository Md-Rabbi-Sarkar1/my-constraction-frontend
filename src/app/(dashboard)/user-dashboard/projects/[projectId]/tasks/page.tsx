"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { CreateTaskModal } from "@/components/form/CreateTaskModal";

import { Button } from "@/components/ui/button";

import { TaskItem } from "@/api/task.api";
import { useGetProjectTasks } from "@/hooks/task.hook";

export default function ProjectTasksPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { data: tasks = [], isLoading, isError } = useGetProjectTasks(projectId);
console.log(tasks)
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 antialiased text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Project Tasks Pipeline</h1>
          <p className="text-sm text-muted-foreground">Monitor milestones, timelines, and operator crew allocations.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/user-dashboard/projects/${projectId}`)}>
            Back to Dashboard
          </Button>
          <Button onClick={() => setIsTaskModalOpen(true)}>
            Create Task
          </Button>
        </div>
      </div>

      {isLoading && <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse">Syncing tasks metrics data...</div>}
      {isError && <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">Failed to pull project tasks. Try reloading.</div>}

      {/* PIPELINE ARCHIVE DIRECTORY TABLE */}
      {!isLoading && !isError && (
        <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Task Particulars</th>
                <th className="px-6 py-3 font-medium">Pipeline Status</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Timeline Constraint</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task: TaskItem) => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="font-semibold text-slate-950">{task.title}</div>
                    <div className="text-xs text-muted-foreground font-normal max-w-xs truncate mt-0.5">{task.description}</div>
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
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    <div>Start: {task.startDate ? new Date(task.startDate).toLocaleDateString() : "—"}</div>
                    <div className="mt-0.5">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}</div>
                  </td>
                  {/* Redirects cleanly to the specific details modification subpage view path */}
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
                    No tasks currently mapped to this project pipeline. Click "Create Task" to initialize.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}
