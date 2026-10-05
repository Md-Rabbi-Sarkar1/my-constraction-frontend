"use client";

import React from "react";
import Link from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ServicesPage() {
  const serviceOfferings = [
    {
      icon: "📁",
      title: "Dynamic Project Dashboards",
      description: "Consolidate active workspace overview parameters, timeline logs, and allocated budgets in a centralized command interface matrix view.",
    },
    {
      icon: "📋",
      title: "Kanban Pipeline Management",
      description: "Organize project tasks by clear operational pillars (TODO, IN PROGRESS, REVIEW, DONE) with strict priority tier indicators.",
    },
    {
      icon: "👷‍♂️",
      title: "Crew Allocation Management",
      description: "Assign company employees (ADMIN, PROJECT MANAGER, ENGINEER, WORKER) to project rosters cleanly with zero overlapping key errors.",
    },
    {
      icon: "🚨",
      title: "Global Incident Logs Reporting",
      description: "Track site blockages, material faults, and structural incident alerts across the corporation with custom severity filters.",
    },
    {
      icon: "🔧",
      title: "Material Stock Audit Ledger",
      description: "Monitor warehouse item currentStock balances, reorder level alerts thresholds, and log custom PURCHASE or USAGE transactions.",
    },
    {
      icon: "💸",
      title: "Corporate Expense Tracking",
      description: "Log project outlays and capital expenditures across multiple cost centers (LABOR, MATERIALS, TRANSPORTATION) with Zod verification validation.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 antialiased selection:bg-slate-950 selection:text-white">
      {/* SERVICE HERO ROW */}
      <div className="bg-white border-b border-slate-200 py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 leading-none">
            Enterprise Solutions for <br className="hidden sm:inline" /> Construction Operations
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
            Explore our automated management tools engineered to eliminate administrative bottlenecks and drive field performance logging precision.
          </p>
        </div>
      </div>

      {/* SERVICE LIST GRID ITEMS DISPLAY */}
      <div className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceOfferings.map((service) => (
            <div 
              key={service.title} 
              className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm hover:border-slate-300 transition-all hover:shadow-md flex flex-col justify-between space-y-4 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="space-y-2.5">
                <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-xl select-none">
                  {service.icon}
                </div>
                <h3 className="font-extrabold text-slate-950 text-base tracking-tight leading-snug">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Enterprise Integration Standard Verified
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY SECTION FOOTER BANNER BOX */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm max-w-4xl mx-auto">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-slate-950 tracking-tight">Need a Bespoke Construction Pipeline Config?</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Our open API schema endpoints integrate seamlessly with custom local databases models, file vaults, and system alerts monitors.
            </p>
          </div>
          <Button disabled variant="outline" className="w-full sm:w-auto text-xs font-semibold h-9 select-none shrink-0 opacity-60">
            Request Custom Consultation
          </Button>
        </div>

      </div>
    </div>
  );
}
