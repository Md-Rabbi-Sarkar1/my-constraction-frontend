"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetGlobalCompanyIssues } from "@/hooks/issues.hook";
import { GlobalIssueItem } from "@/api/issues.api";


export default function GlobalIssuesPage() {
  const router = useRouter();

  // 💡 Call your professional company-wide queries hook
  const { data: issues = [], isLoading, isError } = useGetGlobalCompanyIssues();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 antialiased text-slate-900">
      
      {/* HEADER SEGMENT */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Company Incident Logs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Cross-corporate dashboard covering all logged material failures and structural blockages.</p>
      </div>

      {/* COMPILATION RUNNING INDICATORS LAYER */}
      {isLoading && (
        <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse bg-white shadow-sm">
          Syncing company-wide incident parameters payload streams...
        </div>
      )}
      
      {isError && (
        <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">
          Failed to pull global incident directory. Check server connectivity.
        </div>
      )}

      {/* DATA LAYOUT DISPLAY TABLE */}
      {!isLoading && !isError && (
        <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Issue / Incident Subject</th>
                  <th className="px-6 py-3 font-medium">Site Location</th>
                  <th className="px-6 py-3 font-medium">Severity</th>
                  <th className="px-6 py-3 font-medium">Pipeline Status</th>
                  <th className="px-6 py-3 font-medium text-right">Action View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issues.map((issue: GlobalIssueItem) => (
                  <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="font-semibold text-slate-950">{issue.title}</div>
                      {issue.project?.name && (
                        <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wide mt-1">
                          📁 Project: {issue.project.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      📍 {issue.location || "General Perimeter"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                        issue.priority === "URGENT" || issue.priority === "HIGH" 
                          ? "bg-red-50 text-red-600 font-extrabold" 
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {issue.priority || "MEDIUM"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-extrabold rounded uppercase bg-amber-50 text-amber-700 border border-amber-100/70">
                        {issue.status || "OPEN"}
                      </span>
                    </td>
                    {/* 💡 THE BUTTON: Router pusher routes dynamically directly into your detailed item viewport link */}
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/user-dashboard/issues/${issue.id}`)}
                        className="h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {issues.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground italic">
                      No reported incident records logged across any active project workspace containers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
