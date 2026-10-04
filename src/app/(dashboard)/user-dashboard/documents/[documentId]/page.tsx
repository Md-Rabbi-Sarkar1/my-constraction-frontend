"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetDocumentDetails } from "@/hooks/documents.hook";

interface PageProps {
  params: Promise<{ documentId: string }>;
}

export default function DocumentDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const documentId = unwrappedParams.documentId as string;
  const router = useRouter();

  // 💡 Call your single document data retrieval query hook
  const { data: rawResponse, isLoading, isError } = useGetDocumentDetails(documentId);

  // ========================================================
  // 💡 BULLETPROOF DOCUMENT DATA EXTRACTOR ENGINE:
  // Dynamically unpacks the matching single object block from any backend wrapper format
  // ========================================================
  const dataPayload = (rawResponse as any)?.data?.result || (rawResponse as any)?.result || rawResponse;

  const doc = Array.isArray(dataPayload)
    ? dataPayload.find((d: any) => d.id === documentId)
    : dataPayload;

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
        Syncing secure document asset parameters...
      </div>
    );
  }

  if (isError || !doc) {
    return (
      <div className="p-12 text-center text-red-500 font-semibold border rounded-lg bg-red-50 max-w-xl mx-auto mt-10">
        Failed to load the requested document profile. Record not found in database registry.
      </div>
    );
  }

  const projectLabel = doc.project?.name || "General Corporate Vault Fund";
  const displaySizeMb = doc.sizeBytes ? (Number(doc.sizeBytes) / (1024 * 1024)).toFixed(2) : "0.00";

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER NAVIGATION SEGMENT */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 tracking-wide uppercase block mb-1">
            Document ID Scope: {doc.id}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Document Profile Blueprint</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push("/user-dashboard/documents")}
          className="h-9 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          ← Back to Vault Registry
        </Button>
      </div>

      {/* CORE ASSET PROFILE CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Document Designation Name</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">📄 {doc.name || "Unnamed File Asset"}</h2>
        </div>

        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Linked Project Container Target</span>
          <p className="text-sm font-semibold text-slate-800 mt-1">📁 {projectLabel}</p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Project ID: {doc.projectId}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">File Classification</span>
            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-extrabold uppercase bg-slate-100 text-slate-700 border border-slate-200/60 mt-2 shadow-sm">
              {doc.type || "FILE"}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">MIME Format Specification</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1.5 font-mono text-slate-600">
              {doc.mimeType || "—"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Storage Size Weight</span>
            <span className="text-base font-mono font-bold text-slate-900 block mt-1.5">
              {displaySizeMb} MB <span className="text-xs font-normal text-slate-400">({Number(doc.sizeBytes).toLocaleString()} Bytes)</span>
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Filing Registry Date</span>
            <span className="text-sm font-medium text-slate-800 block mt-1.5">
              📅 {doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>

        {doc.storageKey && (
          <div className="border-t border-slate-100 pt-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Cloud Vault Object Storage Key</span>
            <p className="text-xs font-mono bg-slate-50 border p-2.5 rounded-lg text-slate-600 mt-1.5 break-all select-all">
              {doc.storageKey}
            </p>
          </div>
        )}

      </div>

      {/* LIFE-CYCLE ACTION REGISTRY ROW */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" className="border-slate-200 text-slate-700">
          Modify Document Details
        </Button>
        <Button variant="destructive">
          Delete Permanent Record
        </Button>
      </div>

    </div>
  );
}
