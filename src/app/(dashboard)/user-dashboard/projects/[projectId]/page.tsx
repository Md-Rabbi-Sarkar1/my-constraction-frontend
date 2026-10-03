"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AddMemberModal } from "@/components/form/AddMemberModal";

import { Button } from "@/components/ui/button";
import { useGetProjectDashboard, useGetProjectMembers } from "@/hooks";
import { ProjectMember } from "@/api";

type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
const STATUS_COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.projectId as string;
  const router = useRouter();

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // 1. Core board queries layout tracking indicators
  const { data: dashboard, isLoading: isDashboardLoading, isError } = useGetProjectDashboard(projectId);
  
  // 💡 2. Hook connection retrieving live assigned project crew operators
  const { data: liveProjectMembers = [], isLoading: isMembersLoading } = useGetProjectMembers(projectId);

  const isLoading = isDashboardLoading || isMembersLoading;

  if (isLoading) return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Loading workspace board details...</div>;
  if (isError || !dashboard) return <div className="p-12 text-center text-red-500 font-semibold">Failed to load the project parameters overview.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{dashboard.name}</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">{dashboard.description || "No project description provided."}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsMemberModalOpen(true)}>
            Add Team Member
          </Button>
          <Button onClick={() => router.push(`/user-dashboard/projects/${projectId}/tasks`)}>
            Tasks Page
          </Button>
        </div>
      </div>

      {/* METRICS ROW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Location Context</span>
          <span className="text-sm font-semibold text-slate-900 block mt-1">{dashboard.location || "—"}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Client Specification</span>
          <span className="text-sm font-semibold text-slate-900 block mt-1">{dashboard.clientInfo || "—"}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Allocated Budget</span>
          <span className="text-sm font-mono font-bold text-green-700 block mt-1">
            {dashboard.budget ? `$${Number(dashboard.budget).toLocaleString()}` : "—"}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Operational Timeline</span>
          <span className="text-xs font-semibold text-slate-900 block mt-1">
            {dashboard.startDate ? new Date(dashboard.startDate).toLocaleDateString() : "—"} to {dashboard.expectedEndDate ? new Date(dashboard.expectedEndDate).toLocaleDateString() : "—"}
          </span>
        </div>
      </div>

      {/* LIVE PANELS VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* TASK STREAM BOARD */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Tasks Board Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            {STATUS_COLUMNS.map((col) => {
              const columnTasks = dashboard.tasks?.filter((t: any) => t.status === col) || [];
              return (
                <div key={col} className="bg-slate-100/80 p-3 rounded-xl border border-slate-200/60 min-h-[400px] flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{col}</span>
                    <span className="bg-slate-200 text-slate-700 text-xs font-extrabold px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                  </div>
                  
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px]">
                    {columnTasks.map((task: any) => (
                      <div key={task.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm space-y-2">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                        {task.description && <p className="text-[11px] text-slate-500 line-clamp-2">{task.description}</p>}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                          <span className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-600">{task.priority}</span>
                          <span className="text-slate-500 font-semibold truncate max-w-[80px]">@{task.assignedTo?.name || "Unassigned"}</span>
                        </div>
                      </div>
                    ))}
                    {columnTasks.length === 0 && <div className="text-center py-10 text-xs text-slate-400 italic">No tasks active.</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💡 CREW PANEL SIDEBAR: Now maps your backend-connected liveProjectMembers hook array context */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-950">Allocated Project Crew</h2>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden">
            {liveProjectMembers.map((member: ProjectMember) => (
              <div key={member.email} className="p-3.5 flex items-center justify-between hover:bg-slate-50/40 transition">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-slate-900 truncate">{member.name || "Pending..."}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{member.email}</p>
                </div>
                <span className="text-[9px] bg-slate-100 font-extrabold px-1.5 py-0.5 rounded text-slate-600 uppercase tracking-wider">{member.role}</span>
              </div>
            ))}
            {liveProjectMembers.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-400 italic">No project crew allocated to this team workspace.</div>
            )}
          </div>
        </div>
      </div>

      {/* RENDER DYNAMIC ASSIGNMENT OVERLAY */}
      <AddMemberModal 
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        projectId={projectId}
        currentMembers={liveProjectMembers} // 💡 Pass the live array directly to keep modal dropdown sync in line
      />

    </div>
  );
}
