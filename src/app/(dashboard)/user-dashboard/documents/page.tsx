"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { CreateDocumentModal } from "@/components/form/CreateDocumentModal";

import { Button } from "@/components/ui/button";
import { useGetDocuments } from "@/hooks/documents.hook";
import { DocumentItem } from "@/api/documents.api";

export default function DocumentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: rawDocuments, isLoading, isError } = useGetDocuments();

  const documents: DocumentItem[] = Array.isArray(rawDocuments) ? rawDocuments : [];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 antialiased text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">Documents Vault Registry</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Manage blueprints, contracts, site certifications logs, and file size capacities weights.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto text-xs sm:text-sm">
          Register New Document
        </Button>
      </div>

      {isLoading && <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse bg-white shadow-sm">Syncing vault archives data...</div>}
      {isError && <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">Error establishing vault data server channel parameters.</div>}

      {/* DATA LAYOUT DISPLAY TABLE */}
      {!isLoading && !isError && (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-medium">Document Name / Project Target</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Classification</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">File Dimension Capacity</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Filing Date</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((item: any, index: number) => {
                  const documentId = item.id || `doc-${index}`;
                  const projectLabel = item.project?.name || "General Corporate Vault Fund";
                  const displaySizeMb = item.sizeBytes ? (Number(item.sizeBytes) / (1024 * 1024)).toFixed(2) : "0.00";

                  return (
                    <tr key={documentId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-bold text-slate-950">
                        <div>📄 {item.name || "Unnamed Document Attachment"}</div>
                        <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wide mt-1">📁 Site: {projectLabel}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold rounded bg-slate-100 text-slate-700 uppercase">
                          {item.type || "FILE"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs font-mono text-slate-600 font-semibold">
                        {displaySizeMb} MB
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-xs text-slate-500 font-medium">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          // 💡 Pushes browser routing straight to the standalone document sub-details profile page path
                          onClick={() => router.push(`/user-dashboard/documents/${documentId}`)}
                          className="h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-12 text-center text-sm text-muted-foreground italic">
                      No matching resource documents filed inside this vault registry list yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL WINDOW POUP ELEMENT */}
      <CreateDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
