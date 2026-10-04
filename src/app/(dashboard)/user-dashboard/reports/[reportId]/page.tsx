"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetDailyReportDetails } from "@/hooks/report.hook";

interface PageProps {
  params: Promise<{ reportId: string }>;
}

export default function DailyReportDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const reportId = unwrappedParams.reportId as string;
  const router = useRouter();

  const { data: rawResponse, isLoading, isError } = useGetDailyReportDetails(reportId);

  const dataPayload = (rawResponse as any)?.data?.result || (rawResponse as any)?.result || rawResponse;
  const report = Array.isArray(dataPayload) ? dataPayload.find((r: any) => r.id === reportId) : dataPayload;

  if (isLoading) return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Syncing operations registers...</div>;
  if (isError || !report) return <div className="p-12 text-center text-red-500 font-semibold border rounded-lg bg-red-50 max-w-xl mx-auto mt-10">Field Log record missing from system registry.</div>;

  const projectLabel = report.project?.name || "General Structural Fund Overhead";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Report Log UUID: {reportId}</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Operations Log Sheet</h1>
        </div>
        <Button variant="outline" onClick={() => router.push("/user-dashboard/daily-reports")}>← Back to Logs</Button>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <span className="block text-[11px] font-bold uppercase text-slate-400">Target Linked Site</span>
          <h2 className="text-base font-bold text-slate-900 mt-1">📁 {projectLabel}</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-400">Shift Total Hours</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">⏱️ {report.hoursWorked} Hrs</span>
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-400">Progress Benchmark</span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">{report.progressPct}% Done</span>
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-400">Report Date</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1">📅 {report.reportDate ? new Date(report.reportDate).toLocaleDateString() : "—"}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <span className="block text-[11px] font-bold uppercase text-slate-400">Work Completed Remarks</span>
          <p className="text-sm text-slate-700 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-lg whitespace-pre-wrap font-medium">{report.workCompleted}</p>
        </div>

        {/* WORKER CREW ROSTER TABULATOR CARD ELEMENT */}
        <div className="border-t pt-4 space-y-2">
          <span className="block text-[11px] font-bold uppercase text-slate-400">Active Crew Members Logged</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(report.workers || []).map((w: any, idx: number) => (
              <div key={idx} className="p-2.5 bg-slate-50 border rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">👷‍♂️ {w.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{w.role || "General Labor"}</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">{w.hoursWorked || 0} hrs</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-400">Materials Used Ledger</span>
            <p className="text-xs text-slate-600 mt-1 bg-slate-50/50 p-2 rounded border">{report.materialsUsed || "— No manual materials entries tracked."}</p>
          </div>
          <div>
            <span className="block text-[11px] font-bold uppercase text-slate-400">Problems / Blockages Log</span>
            <p className="text-xs text-red-600 mt-1 bg-red-50/50 p-2 rounded border border-red-100 font-semibold">{report.problemsEncountered || "— Secure site conditions. No incidents reported."}</p>
          </div>
        </div>

        {report.notes && (
          <div className="border-t pt-4">
            <span className="block text-[11px] font-bold uppercase text-slate-400">Auditor Notes</span>
            <p className="text-xs italic text-slate-500 mt-1">{report.notes}</p>
          </div>
        )}
      </div>

    </div>
  );
}
