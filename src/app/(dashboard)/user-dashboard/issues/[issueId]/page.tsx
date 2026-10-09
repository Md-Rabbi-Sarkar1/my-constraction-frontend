"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetIssueById, useUpdateIssueStatus, useDeleteIssueRecord } from "@/hooks/issues.hook";
import { toast } from "@/components/ui/toast";

interface PageProps {
  params: Promise<{ projectId: string; issueId: string }>;
}

export default function IssueDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.projectId as string;
  const issueId = unwrappedParams.issueId as string; // 💡 Extracted directly from [issueId] folder route token
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<any>("");

  // TanStack Query Query Data Hooks
  const { data: issue, isLoading, isError } = useGetIssueById(issueId);

  // TanStack Query Mutations Hooks
  const { mutateAsync: updateStatus, isPending: updatePending } = useUpdateIssueStatus(issueId);
  const { mutateAsync: removeIssue, isPending: deletePending } = useDeleteIssueRecord(issueId);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
        Syncing reported incident lifecycle parameters...
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="p-12 text-center text-red-500 font-semibold border rounded-lg bg-red-50 max-w-xl mx-auto mt-10">
        Failed to load the requested incident logs parameters. Issue ID not found in database registry.
      </div>
    );
  }

  const handleStatusChangeSubmit = async () => {
    if (!selectedStatus) return;
    try {
      await updateStatus({ status: selectedStatus });
      setIsEditing(false);
     toast.add({ title: "Incident resolution pipeline status modified successfully!" });
    } catch (err) {
      toast.add({ title: "Failed to modify pipeline status parameters" });
    }
  };

  const handleIncidentDeletion = async () => {
    const isConfirmed = window.confirm(
      "Are you absolutely sure you want to permanently delete this incident record from the company log files?"
    );
    if (!isConfirmed) return;

    try {
      // 💡 Sends the verified issueId to delete unique records cleanly
      await removeIssue();
      toast.add({ title: "Incident log successfully erased."});
      
      router.push(`/user-dashboard/projects/${projectId}`);
    } catch (err) {
      toast.add({ title: "Failed to execute data destruction loop."});
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-red-600 tracking-wide uppercase block mb-1">
            Issue Log ID Scope: {issue.id}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Incident Profile Details</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push(`/user-dashboard/issues`)}
          className="h-9 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          ← Back to Project Board
        </Button>
      </div>

      {/* CORE DETAILS MATRIX PROFILE CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Issue Subject / Title</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">{issue.title}</h2>
        </div>

        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Detailed Blockage Description</span>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed bg-slate-50/50 border border-slate-100 p-3.5 rounded-lg whitespace-pre-wrap">
            {issue.description || "No diagnostic remarks specified for this incident report."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Incident Severity</span>
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-extrabold uppercase mt-1.5 border shadow-sm ${
              issue.priority === "URGENT" || issue.priority === "HIGH" 
                ? "bg-red-50 text-red-600 border-red-100" 
                : "bg-slate-100 text-slate-600 border-slate-200/60"
            }`}>
              {issue.priority || "MEDIUM"}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Resolution Status</span>
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1.5">
                <select 
                  className="border border-slate-200 rounded-md p-1.5 bg-white text-xs outline-none cursor-pointer font-bold text-slate-700"
                  value={selectedStatus || issue.status}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
                <Button size="sm" onClick={handleStatusChangeSubmit} disabled={updatePending} className="h-7 text-[10px] px-2 font-bold">
                  {updatePending ? "Saving..." : "Save"}
                </Button>
              </div>
            ) : (
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100 mt-1.5 shadow-sm">
                {issue.status || "OPEN"}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Logged Site Location</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1.5">
              📍 {issue.location || "General Workspace Perimeter"}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Report Timestamp</span>
            <span className="text-sm font-medium text-slate-500 block mt-1.5">
              {issue.createdAt ? new Date(issue.createdAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Inspector</span>
          <p className="text-sm font-semibold text-slate-800 mt-1.5 font-mono truncate bg-slate-50 p-2 border rounded-md">
            {issue.assignee?.name || "Unassigned Operational Incident Account"}
          </p>
        </div>
      </div>

      {/* ACTION UTIL ROW */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button 
          variant="outline" 
          disabled={updatePending || deletePending}
          onClick={() => {
            setIsEditing(!isEditing);
            setSelectedStatus(issue.status);
          }}
          className="border-slate-200 text-slate-700 text-xs font-semibold h-9"
        >
          {isEditing ? "Cancel Modification" : "Modify Status"}
        </Button>
        <Button 
          variant="destructive"
          disabled={updatePending || deletePending}
          onClick={handleIncidentDeletion}
          className="text-xs font-bold h-9 flex items-center gap-1.5"
        >
          {deletePending && <span className="w-3 h-3 animate-spin border-2 border-white border-t-transparent rounded-full" />}
          Delete Incident Log
        </Button>
      </div>

    </div>
  );
}
