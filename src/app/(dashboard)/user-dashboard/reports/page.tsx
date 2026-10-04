"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { CreateDailyReportModal } from "@/components/form/CreateDailyReportModal";

import { Button } from "@/components/ui/button";
import { useGetDailyReports } from "@/hooks/report.hook";
import { DailyReportItem } from "@/api/report.api";

export default function DailyReportsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: rawReports, isLoading, isError } = useGetDailyReports();

  const reports: DailyReportItem[] = Array.isArray(rawReports) ? rawReports : [];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 antialiased text-slate-900">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">Daily Field Operations Log</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Monitor work achievements, shift hour tracking metrics, and dynamic active crew logs.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto text-xs sm:text-sm">
          File Daily Report
        </Button>
      </div>

      {isLoading && <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse bg-white shadow-sm">Syncing operations registers...</div>}
      {isError && <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">Error establishing database transaction stream.</div>}

      {!isLoading && !isError && (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-medium">Log Summary / Project</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Work Shift Capacity</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Progress Done</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Report Date</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((item: any, index: number) => {
                  const reportId = item.id || `rep-${index}`;
                  const projectLabel = item.project?.name || "General Operational Fund Pool";

                  return (
                    <tr key={reportId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-bold text-slate-950">
                        <div className="line-clamp-1">📋 {item.workCompleted}</div>
                        <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wide mt-1">📁 Site: {projectLabel}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-slate-600 font-bold">
                        ⏱️ {item.hoursWorked || 0} Total Hrs
                      </td>
                      <td className="px-4 sm:px-6 py-4 font-mono">
                        <span className="inline-block px-2 py-0.5 rounded font-extrabold text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {item.progressPct || 0}% Complete
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-slate-500 font-medium">
                        {item.reportDate ? new Date(item.reportDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/user-dashboard/reports/${reportId}`)}
                          className="h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-12 text-center text-sm text-muted-foreground italic">
                      No matching field daily logs filed inside this directory envelope register yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateDailyReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}