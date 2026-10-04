"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { CreateMaterialModal } from "@/components/form/CreateMaterialModal";
import { Button } from "@/components/ui/button";
import { useGetMaterials } from "@/hooks/material.hook";
import { MaterialItem } from "@/api/material.api";

export default function MaterialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: materials = [], isLoading, isError } = useGetMaterials();
console.log(materials)
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 antialiased text-slate-900">
      
      {/* HEADER ROW BAR SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">Materials Depot Inventory</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Track warehouse stock limits, volume allocation weights, and automated shortage flags.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto text-xs sm:text-sm">
          Register New Material
        </Button>
      </div>

      {isLoading && <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse bg-white shadow-sm">Syncing logistics resource listings array...</div>}
      {isError && <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">Error establishing database connection pipeline.</div>}

      {/* INVENTORY TRACKING LOG DIRECTORY TABLE */}
      {!isLoading && !isError && (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          {/* 💡 FIXED: This wrapper enables responsive horizontal swiping on mobile viewports */}
          <div className="w-full overflow-x-auto scrollbar-thin">
            {/* set a min-width to ensure fields remain proportionate and readable on small screens */}
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead className="bg-slate-50 border-b text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-medium">Material Name Particulars</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Measurement Unit</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Current Stock Level</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Reorder Warning Threshold</th>
                  <th className="px-4 sm:px-6 py-3 font-medium">Status State</th>
                  <th className="px-4 sm:px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map((item: MaterialItem) => {
                  const isShortage = item.currentStock <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 font-bold text-slate-950 truncate max-w-[200px]">{item.name}</td>
                      <td className="px-4 sm:px-6 py-4 text-slate-600 font-medium">{item.unit}</td>
                      <td className="px-4 sm:px-6 py-4 font-mono font-bold text-slate-900">{item.currentStock.toLocaleString()}</td>
                      <td className="px-4 sm:px-6 py-4 font-mono text-slate-500">{item.reorderLevel.toLocaleString()}</td>
                      <td className="px-4 sm:px-6 py-4">
                        {isShortage ? (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-rose-50 text-red-600 border border-rose-100 uppercase animate-pulse">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                            Stock Secure
                        </span>
                        )}
                      </td>
                      
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/user-dashboard/materials/${item.id}`)}
                          className="h-8 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {materials.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 sm:px-6 py-12 text-center text-sm text-muted-foreground italic">
                      No resource inventory materials logged across this company shell folder yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULAR COMPONENT BOUNDARY ENCLOSURES */}
      <CreateMaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
