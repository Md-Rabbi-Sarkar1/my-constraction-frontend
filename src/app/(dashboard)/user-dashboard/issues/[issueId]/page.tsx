"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetIssueById } from "@/hooks/issues.hook";

interface PageProps {
  params: Promise<{ issueId: string }>;
}

export default function IssueDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const issueId = unwrappedParams.issueId as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 💡 Optional: Safely capture projectId from query parameters if needed for backwards navigation layout mapping
  const projectId = searchParams.get("projectId") || "active";

  // 💡 Call your single incident record retrieval query hook
  const { data: issue, isLoading, isError } = useGetIssueById(issueId);
console.log(issue)
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

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER NAVIGATION SEGMENT */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-red-600 tracking-wide uppercase block mb-1">
            Issue Log ID Scope: {issue.id}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Incident Profile Details</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="h-9 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          ← Go Back
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
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100 mt-1.5 shadow-sm">
              {issue.status || "OPEN"}
            </span>
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
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Inspector / Assignee ID</span>
          <p className="text-sm font-semibold text-slate-800 mt-1.5 font-mono">
            {issue.assigneeId || "Unassigned Operational Incident Account"}
          </p>
        </div>

      </div>

      {/* LIFE-CYCLE MODIFICATION UTILITY ACTION ROW */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" className="border-slate-200 text-slate-700">
          Modify Status
        </Button>
        <Button variant="destructive">
          Delete Incident Log
        </Button>
      </div>

    </div>
  );
}
