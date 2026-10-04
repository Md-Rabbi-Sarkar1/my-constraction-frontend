"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; 

import { Button } from "@/components/ui/button";
import { useGetNotifications, useMarkAsRead } from "@/hooks/notification.hook";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const router = useRouter(); 

  // Assemble unified tracking filters parameter payload
  const activeFilters = {
    page,
    pageSize,
    unreadOnly: unreadOnly || undefined,
  };

  // Execute TanStack Query data payload fetch loop
  const { data: rawResponse, isLoading, isError } = useGetNotifications(activeFilters);
  const { mutateAsync: readNotification } = useMarkAsRead();

  // ========================================================
  // 💡 BULLETPROOF NOTIFICATION DATA FLATTENER ENGINE:
  // Extracts the actual notifications list safely across all response variations
  // ========================================================
  let notifications: any[] = [];
  let totalPages = 1;

  if (rawResponse) {
    // 💡 FIXED FOR YOUR EXACT DATA STRUCTURE:
    // If response is an object containing a 'notifications' field
    if (rawResponse && typeof rawResponse === "object" && "notifications" in rawResponse) {
      const nestedNotifs = (rawResponse as any).notifications;
      
      // If the notifications field itself is a tuple array: [Array(1), 1]
      if (Array.isArray(nestedNotifs) && nestedNotifs.length === 2 && Array.isArray(nestedNotifs[0])) {
        notifications = nestedNotifs[0];
      } 
      // If the notifications field is already a flat array of items
      else if (Array.isArray(nestedNotifs)) {
        notifications = nestedNotifs;
      }
      
      totalPages = (rawResponse as any).totalPages || 1;
    }
    // Backup 1: If it maps directly to a tuple array layout wrapper at root level
    else if (Array.isArray(rawResponse) && rawResponse.length === 2 && Array.isArray(rawResponse[0])) {
      notifications = rawResponse[0];
      const totalCount = typeof rawResponse[1] === "number" ? rawResponse[1] : notifications.length;
      totalPages = Math.ceil(totalCount / pageSize) || 1;
    }
    // Backup 2: If it is a direct flat array query response package
    else if (Array.isArray(rawResponse)) {
      notifications = rawResponse;
      totalPages = 1;
    }
    // Backup 3: Drill down through standard nested object envelope schemas
    else if (typeof rawResponse === "object") {
      const nested = (rawResponse as any).data?.result || (rawResponse as any).result || rawResponse;
      if (Array.isArray(nested)) {
        notifications = nested;
      } else if (nested && Array.isArray(nested.notifications)) {
        if (Array.isArray(nested.notifications[0])) {
          notifications = nested.notifications[0];
        } else {
          notifications = nested.notifications;
        }
        const totalCount = nested.totalCount || nested.notifications.length;
        totalPages = Math.ceil(totalCount / pageSize) || 1;
      }
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await readNotification(id);
    } catch (err) {
      console.error("Failed to update message read state.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 antialiased text-slate-900 min-h-screen">
      
      {/* HEADER ROW BAR SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">System Notifications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor construction log updates, project task modifications, and budget shortage warnings.
          </p>
        </div>
        
        {/* UNREAD SWITCH CHECKBOX TOGGLE CONTROL */}
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border p-2.5 rounded-lg shadow-sm cursor-pointer hover:bg-slate-50">
          <input 
            type="checkbox" 
            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer"
            checked={unreadOnly} 
            onChange={(e) => { setUnreadOnly(e.target.checked); setPage(1); }}
          />
          Show Unread Messages Only
        </label>
      </div>

      {/* COMPILATION RUNNING INDICATORS LAYER */}
      {isLoading && (
        <div className="rounded-md border p-12 text-center text-sm text-muted-foreground animate-pulse bg-white shadow-sm">
          Syncing application notifications pipeline feed...
        </div>
      )}
      
      {isError && (
        <div className="rounded-md border border-red-200 p-8 text-center text-sm text-red-600 bg-red-50">
          Error establishing live update network connection.
        </div>
      )}

      {/* FEED NOTIFICATION CARD REPEATER BLOCK */}
      {!isLoading && !isError && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            {notifications.map((item: any, index: number) => {
              const stableRowKey = item.id || item.createdAt || `notif-row-${index}`;

              return (
                <div 
                  key={stableRowKey} 
                  className={`p-4 rounded-xl border transition-all shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-white ${
                    !item.isRead ? "border-l-4 border-l-slate-900 font-medium" : "opacity-80"
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-950">{item.title || "Log Notification"}</h3>
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "—"}
                    </span>
                  </div>

                  {/* BUTTON ACTIONS SECTION CONTAINER */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/user-dashboard/notifications/${item.id}`)}
                      className="h-8 text-xs font-semibold bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Details
                    </Button>

                    {/* ACTION TRIGGER BUTTON */}
                    {!item.isRead && item.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkRead(item.id)}
                        className="h-8 text-xs font-semibold bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>

                </div>
              );
            })}

            {notifications.length === 0 && (
              <div className="rounded-xl border border-dashed bg-slate-50/50 p-12 text-center text-sm text-muted-foreground italic">
                No active notification reports found matching your filter parameters.
              </div>
            )}
          </div>

          {/* PAGINATION PANEL FOOTER CONTROLS */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1} 
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-600 px-2">Page {page} of {totalPages}</span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= totalPages} 
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
