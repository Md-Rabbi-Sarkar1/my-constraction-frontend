"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const coreValues = [
    {
      title: "Structural Integrity",
      description: "We enforce absolute transparency and precision tracking across every structural metric and physical milestone.",
    },
    {
      title: "Operational Excellence",
      description: "From material stock management to real-time labor logs, we eliminate field operational ambiguities entirely.",
    },
    {
      title: "Absolute Safety",
      description: "Every site incident and structural anomaly is recorded instantly to guarantee field inspector security parameters.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 antialiased selection:bg-slate-950 selection:text-white">
      {/* HERO HERO SECTION */}
      <div className="bg-white border-b border-slate-200 py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Our Identity
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 leading-none">
            Precision Management for <br className="hidden sm:inline" /> Modern Construction
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed pt-2">
            We provide cutting-edge infrastructure tracking ecosystems that connect engineers, managers, and workforce crew operations seamlessly.
          </p>
        </div>
      </div>

      {/* CORE IDENTITY CONTENT BODY */}
      <div className="py-16 px-4 max-w-5xl mx-auto space-y-16">
        
        {/* STORY GRID SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
              The Evolution of Project Governance
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Founded on the principles of precision and engineering verification, our system transforms the chaotic workflow of construction sites into highly structural, trackable logs data streams.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We eliminate administrative friction by allowing teams to report site operations metrics, record expenses, monitor materials logistics parameters, and flag incidents instantly.
            </p>
          </div>
          <div className="bg-white border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="h-10 w-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold font-mono text-sm">
              01
            </div>
            <h4 className="font-bold text-slate-950 text-sm">Empowering Local Workspaces</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Whether allocating an operator to a multi-million dollar corporate structure crew or reviewing material receipts, our data engine ensures compliance, visibility, and tracking parameters remain intact.
            </p>
          </div>
        </div>

        {/* VALUES REPEATER SECTION */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">Our Operational Core Values</h2>
            <p className="text-xs text-slate-500">The functional constraints that guide our infrastructure development models.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {coreValues.map((val) => (
              <div key={val.title} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-2">
                <h3 className="font-extrabold text-sm text-slate-950">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CALL TO ACTION BOTTOM LAYOUT ROW */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Ready to Audit Your Field Performance?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Gain immediate control over your project pipeline tasks, crew member assignments, and fiscal expense metrics today.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button variant="secondary" className="text-xs font-semibold h-9 px-5">
              <Link href="/services">Discover Services</Link>
            </Button>
            <Button  className="text-xs font-semibold h-9 px-5 bg-white text-slate-900 hover:bg-slate-100 border-none">
              <Link href="/login">Access Account Portal</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
