"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useGetNotificationDetails } from "@/hooks/notification.hook";

interface PageProps {
  params: Promise<{ notificationId: string }>;
}

export default function NotificationDetailsPage({ params }: PageProps) {
  const unwrappedParams = React.use(params);
  const notificationId = unwrappedParams.notificationId as string;
  const router = useRouter();

  // 💡 Call your single notification data retrieval hook
  const { data: notification, isLoading, isError } = useGetNotificationDetails(notificationId);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium animate-pulse">
        Syncing notification alert parameters...
      </div>
    );
  }

  if (isError || !notification) {
    return (
      <div className="p-12 text-center text-red-500 font-semibold border rounded-lg bg-red-50 max-w-xl mx-auto mt-10">
        Failed to load the requested notification data. ID not found in database registry.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 tracking-wide uppercase block mb-1">
            Notification Scope ID: {notification.id}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Alert Notification Details</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push("/user-dashboard/notifications")}
          className="h-9 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          ← Back to Notifications Feed
        </Button>
      </div>

      {/* DETAILED LOG METRICS PROFILE CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        
        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Subject / Title</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">{notification.title || "Log Update Notification"}</h2>
        </div>

        <div>
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Message Information</span>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed bg-slate-50/50 border border-slate-100 p-4 rounded-lg whitespace-pre-wrap font-medium">
            {notification.message || "No message body details specified for this system record log."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Read Status State</span>
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase mt-1.5 border shadow-sm ${
              notification.isRead 
                ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                : "bg-blue-50 text-blue-700 border-blue-100"
            }`}>
              {notification.isRead ? "Read Record" : "Unread Alert"}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Logged Timestamp</span>
            <span className="text-sm font-semibold text-slate-800 block mt-1.5">
              📅 {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "—"}
            </span>
          </div>
        </div>

        {notification.type && (
          <div className="border-t border-slate-100 pt-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">System Source Context Type</span>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 rounded text-slate-700">
              {notification.type}
            </span>
          </div>
        )}

      </div>

    </div>
  );
}
