"use client";

import React from "react";

export default function GlobalLoadingPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50/50 antialiased text-slate-900">
      <div className="flex flex-col items-center space-y-4">
        
        {/* HYPER-SMOOTH CIRCULAR PROGRESS SYNCING INDICATOR */}
        <div className="relative flex items-center justify-center h-12 w-12">
          <div className="absolute h-full w-full rounded-full border-4 border-slate-200" />
          <div className="absolute h-full w-full rounded-full border-4 border-slate-950 border-t-transparent animate-spin duration-700" />
        </div>

        <div className="text-center space-y-0.5">
          <p className="text-sm font-bold tracking-tight text-slate-950 animate-pulse">
            Syncing Corporate Ledger Dashboard...
          </p>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Loading Resource Architecture Parameters
          </p>
        </div>

      </div>
    </div>
  );
}
