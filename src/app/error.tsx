"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // 💡 Securely log internal server failures or stack traces directly to your error tracking engine
    console.error("=== Next.js Root Runtime Error Crash ===");
    console.error("Trace Log Details:", error);
    if (error.digest) console.log(`Digest Token Reference: ${error.digest}`);
    console.log("========================================");
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 antialiased text-slate-900">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200/80 p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-150">
        
        {/* RUNTIME ERROR ICON CONTAINER */}
        <div className="mx-auto h-14 w-14 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600">
          <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black tracking-tight text-slate-950">Application Runtime Error</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The workspace engine encountered a critical boundary breakdown parameter error while parsing layout properties.
          </p>
        </div>

        {error.message && (
          <div className="p-3 bg-slate-50 border rounded-lg text-left font-mono text-[10px] text-slate-500 break-all max-h-[80px] overflow-y-auto">
            <b>Error Trace Message:</b> {error.message}
          </div>
        )}

        {/* INTERACTIVE ACTION SLOTS */}
        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.assign("/")} 
            className="w-full text-xs font-semibold h-9"
          >
            Go to Home
          </Button>
          <Button 
            size="sm"
            onClick={() => reset()} 
            className="w-full text-xs font-semibold h-9 bg-slate-900 hover:bg-slate-800 text-white"
          >
            Attempt Recovery
          </Button>
        </div>

      </div>
    </div>
  );
}
