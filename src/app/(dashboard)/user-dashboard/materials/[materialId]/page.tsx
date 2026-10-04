"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { RecordTransactionModal } from "@/components/form/RecordTransactionModal";
import { Button } from "@/components/ui/button";
import { useGetMaterialDetails } from "@/hooks/material.hook";

interface PageProps {
  params: Promise<{ materialId: string }>;
}

export default function MaterialDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const materialId = unwrappedParams.materialId as string;
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: material, isLoading, isError } = useGetMaterialDetails(materialId);
console.log(material)
  if (isLoading) return <div className="p-12 text-center text-slate-500 font-medium animate-pulse">Syncing stock profiles matrix...</div>;
  if (isError || !material) return <div className="p-12 text-center text-red-500 font-semibold border rounded-lg bg-red-50 max-w-xl mx-auto mt-10">Material tracking item profile missing from registry.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Item Hash ID: {material.id}</span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">{material.name} Profile</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/user-dashboard/materials")}>← Inventory List</Button>
          <Button onClick={() => setIsModalOpen(true)}>Record Transaction</Button>
        </div>
      </div>

      {/* PARAMETERS CARD BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <span className="block text-[11px] font-bold uppercase text-slate-400">Measurement Unit</span>
          <span className="text-sm font-semibold text-slate-900 block mt-1">{material.unit}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <span className="block text-[11px] font-bold uppercase text-slate-400">Current Stock Available</span>
          <span className="text-lg font-mono font-bold text-slate-950 block mt-0.5">{material.currentStock?.toLocaleString() || 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <span className="block text-[11px] font-bold uppercase text-slate-400">Minimum Reorder Limit</span>
          <span className="text-sm font-mono font-semibold text-slate-600 block mt-1">{material.reorderLevel?.toLocaleString() || 0}</span>
        </div>
      </div>

      {/* TRANSACTION HISTORICAL LEDGER TABLE */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-950 tracking-tight">Material Transaction Audit Ledger</h2>
        <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Log Date</th>
                <th className="px-6 py-3 font-medium">Action Type</th>
                <th className="px-6 py-3 font-medium">Quantity Volume</th>
                <th className="px-6 py-3 font-medium">Linked Project Context</th>
                <th className="px-6 py-3 font-medium">Memo Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(material.transactions || []).map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded uppercase ${
                      tx.type === "PURCHASE" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      tx.type === "USAGE" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>{tx.type}</span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{tx.quantity?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-xs font-bold text-blue-600 uppercase tracking-wide">
                    {tx.project?.name ? `📁 ${tx.project.name}` : "— (Depot)"}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 truncate max-w-xs">{tx.note || "—"}</td>
                </tr>
              ))}
              {(!material.transactions || material.transactions.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-muted-foreground italic">No logged transactional ledger movements recorded for this item yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RecordTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} materialId={materialId} />
    </div>
  );
}
