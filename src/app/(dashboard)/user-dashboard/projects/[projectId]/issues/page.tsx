"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { CreateIssueModal } from "@/components/form/CreateIssueModal";

import { Button } from "@/components/ui/button";
import { useGetProjectIssues } from "@/hooks/issues.hook";
import { IssueItem } from "@/api/issues.api";

export default function ProjectIssuesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: issues = [], isLoading, isError } = useGetProjectIssues(projectId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 antialiased text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Project Incident Log</h1>
          <p className="text-sm text-muted-foreground">Monitor reported blockages, material faults, and resolving statuses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/user-dashboard/projects/${projectId}`)}>
            Back to Dashboard
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            Report Issue
          </Button>
        </div>
      </div>

      {isLoading && <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse bg-white">Loading project incident streams...</div>}
      {isError && <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">Error fetching incident records.</div>}

      {/* INCIDENT LOGS TABLE */}
      {!isLoading && !isError && (
        <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Issue / Incident Particulars</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((issue: IssueItem) => (
                <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="font-semibold text-slate-950">{issue.title}</div>
                    <div className="text-xs text-muted-foreground font-normal max-w-xs truncate mt-0.5">{issue.description}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{issue.location || "General Site"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                      issue.priority === "URGENT" || issue.priority === "HIGH" ? "bg-red-50 text-red-600 font-extrabold" : "bg-slate-100 text-slate-600"
                    }`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-xs font-extrabold rounded uppercase bg-amber-50 text-amber-700 border border-amber-100">
                      {issue.status}
                    </span>
                  </td>
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
                    No active incident records reported for this pipeline window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SEPARATE MODAL ELEMENT CALL */}
      <CreateIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}
