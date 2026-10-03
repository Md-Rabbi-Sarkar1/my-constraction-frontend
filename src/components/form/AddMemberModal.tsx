"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useAddProjectMember, useGetAllUsers } from "@/hooks";
import { UserItem } from "@/api";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  currentMembers: any[];
}

const addMemberSchema = z.object({
  userId: z.string().uuid("Please select a valid user from the dropdown list"),
});

type FormValues = z.infer<typeof addMemberSchema>;

export function AddMemberModal({ isOpen, onClose, projectId, currentMembers = [] }: AddMemberModalProps) {
  const [formError, setFormError] = useState("");
  
  // 💡 Using the exact same query hook configuration from your working users page
  const { data: allUsers = [], isLoading: isUsersLoading } = useGetAllUsers();
  const { mutateAsync: assignMember, isPending: isAssigning } = useAddProjectMember(projectId);

  const form = useForm({
    defaultValues: { userId: "" } as FormValues,
    onSubmit: async ({ value }) => {
      setFormError("");
      const result = addMemberSchema.safeParse(value);
      
      if (!result.success) {
        setFormError("Please select a team member from the dropdown menu");
        return;
      }

      try {
        // 💡 Sends the clean 36-character raw UUID payload string under the hood
        await assignMember(result.data.userId);
        form.reset();
        setFormError("");
        onClose();
        alert("Member successfully added to project!");
      } catch (err: any) {
        setFormError(err?.message || "Failed to add member to project.");
      }
    },
  });

  if (!isOpen) return null;

  // 💡 Identical to your working table page logic check
  const usersArray: UserItem[] = Array.isArray(allUsers) ? allUsers : [];

  // Extract assigned user identities safely from the dashboard members context payload array
  const assignedUserIds: string[] = currentMembers
    .map((m: any) => m?.userId || m?.user?.id || m?.id || "")
    .filter(Boolean);

  // Filter out any workspace user who has already been assigned to this crew
  const eligibleUsers = usersArray.filter((u: UserItem) => u.id && !assignedUserIds.includes(u.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950">Allocate Team Member</h3>
          <p className="text-xs text-slate-500 mt-0.5">Assign an employee from the workspace directory to this crew.</p>
        </div>
        
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            form.handleSubmit(); 
          }} 
          className="space-y-4 text-sm"
        >
          {/* TanStack Field Parameter Registration Wrapper */}
          <form.Field name="userId">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Select Company Employee</label>
                <select 
                  disabled={isAssigning || isUsersLoading}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-slate-400 text-sm bg-white cursor-pointer disabled:bg-slate-100" 
                  value={field.state.value} 
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Choose technician...</option>
                  {eligibleUsers.map((u: UserItem) => (
                    // 💡 Under the hood: assigns the exact unique database string UUID ID
                    <option key={u.id} value={u.id}>
                      {/* 💡 Dropdown display interface: Renders ONLY the user name text value */}
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
                {formError && <p className="text-red-500 text-xs mt-1">{formError}</p>}
                
                {eligibleUsers.length === 0 && !isUsersLoading && (
                  <p className="text-amber-600 text-xs mt-1 font-medium bg-amber-50 border border-amber-200 p-2 rounded">
                    All workspace users are already assigned to this project context.
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <button 
              type="button" 
              disabled={isAssigning}
              onClick={() => { 
                form.reset(); 
                setFormError(""); 
                onClose(); 
              }} 
              className="px-4 py-2 border rounded-md font-semibold text-slate-700 hover:bg-slate-50 transition text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isAssigning || eligibleUsers.length === 0}
              className="px-4 py-2 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 transition text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigning ? "Assigning..." : "Allocate Operator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
